const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided', token});
  }

  // Extract the token from the "Bearer" prefix
  const tokenWithoutBearer = token.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(tokenWithoutBearer, secret);
    req.user = decoded; // Store the decoded user data in the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
}

module.exports = { verifyToken, checkAdmin };