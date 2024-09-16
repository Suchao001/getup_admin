import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const currentTime = Math.floor(Date.now() / 1000); 
    if (decoded.exp < currentTime) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateToken;
