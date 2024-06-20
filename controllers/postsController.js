const { Posts, Alumni, FavoritePosts } = require('../models');

async function createPost(req, res) {
    const { title, image, postBody } = req.body;
    const { alumniId } = req.user;

    if (!title || !postBody) {
        return res.status(400).json({ message: 'The body of the post and the title cannot be empty' });
    }

    try {
        await Posts.create({
            title,
            image,
            postBody,
            alumniId
        });

        const alumni = await Alumni.findByPk(alumniId);
        if (alumni) {
            alumni.experiencePoints += 100;
            if (alumni.experiencePoints >= 500) {
                alumni.experiencePoints = 0;e
                alumni.level += 1;
            }
            await alumni.save();
        }

        res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getPosts(req, res) {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Posts.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        const totalPages = Math.ceil(count / limit);

        const pagination = {
            total: count,
            pages: totalPages,
            current: parseInt(page),
            limit: parseInt(limit)
        };

        const links = [];
        if (pagination.current < pagination.pages) {
            links.push({
                rel: 'next-page',
                href: `/posts?limit=${limit}&page=${pagination.current + 1}`,
                method: 'GET'
            });
        }

        res.status(200).json({ pagination, posts: rows, links });
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function alterPost(req, res) {
    const { postId } = req.params;
    const { title, image, postBody } = req.body;

    try {
        let post = await Posts.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'The post does not exist' });
        }

        if (title) {
            post.title = title;
        }
        if (image) {
            post.image = image;
        }
        if (postBody) {
            post.postBody = postBody;
        }

        await post.save();

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function deletePost(req, res) {
    const { postId } = req.params;

    try {
        const post = await Posts.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'The post does not exist' });
        }

        await post.destroy();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function favoritePost(req, res) {
    const { postId } = req.params;
    const { alumniId } = req.user;

    try {
        const post = await Posts.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'The post does not exist' });
        }

        const isFavorited = await FavoritePosts.findOne({
            where: {
                alumniId: alumniId,
                postId: postId
            }
        });

        if (isFavorited) {
            return res.status(400).json({ message: 'Post is already favorited' });
        }

        await FavoritePosts.create({
            alumniId: alumniId,
            postId: postId
        });

        res.status(200).json({ message: 'Post favorited successfully' });
    } catch (error) {
        console.error('Error favoriting post:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function unfavoritePost(req, res) {
    const { postId } = req.params;
    const { alumniId } = req.user;

    try {
        const favoritePost = await FavoritePosts.findOne({
            where: {
                postId: postId,
                alumniId: alumniId
            }
        });

        if (!favoritePost) {
            return res.status(404).json({ message: 'The post is not favorited' });
        }

        await favoritePost.destroy();

        res.status(200).json({ message: 'Post favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

async function getPostFavorites(req, res) {
    const { postId } = req.params;

    try {
        const post = await Posts.findByPk(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const favorites = await FavoritePosts.findAll({
            where: {
                postId: postId
            },
            include: [
                {
                    model: Alumni,
                    attributes: ['alumniId', 'name']
                }
            ]
        });

        const formattedFavorites = favorites.map(favorite => ({
            userId: favorite.Alumni.alumniId,
            name: favorite.Alumni.name
        }));

        const response = {
            post: {
                postId: post.postId,
                title: post.title,
                favorites: formattedFavorites
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting post favorites:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
}

module.exports = { createPost, getPosts, alterPost, deletePost, favoritePost, unfavoritePost, getPostFavorites };