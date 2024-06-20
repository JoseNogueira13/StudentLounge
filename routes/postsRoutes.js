const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const postsController = require('../controllers/postsController');
const { verifyToken } = require('../authenticate/auth');

router.post('/', verifyToken, async(req, res, next) => {
    try {
        await postsController.createPost(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async(req, res, next) => {
    try {
        await postsController.getPosts(req, res);
    } catch (error) {
        next(error);
    }
});

router.patch('/:postId', verifyToken, async(req, res, next) => {
    try {
        await postsController.alterPost(req, res);
    } catch (error) {
        next(error);
    }
});~

router.delete('/:postId', verifyToken, async(req, res, next) => {
    try {
        await postsController.deletePost(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/:postId/favorite', verifyToken, async(req, res, next) => {
    try {
        await postsController.favoritePost(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:postId/favorite', verifyToken, async(req, res, next) => {
    try {
        await postsController.unfavoritePost(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:postId/favorite', verifyToken, async(req, res, next) => {
    try {
        await postsController.getPostFavorites(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;