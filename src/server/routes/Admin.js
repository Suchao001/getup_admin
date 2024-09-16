import express from 'express';
import knex from '../config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authenticateToken from '../middleware/authenticateToken.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const getUserInfo = async (user_id) => {
  try {
    const user = await knex('admin')
      .where({ id: user_id })
      .first()
      .select('id', 'username');
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const register = async (username, password) => {
  try {
    const existingUser = await knex('admin')
      .where({ username })
      .first();

    if (existingUser) {
      throw new Error('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await knex('admin').insert({
      username,
      password: hashedPassword,
    });

    console.log('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

const login = async (username, password) => {
  try {
    const user = await knex('admin')
      .where({ username })
      .first();
      
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  } catch (error) {
    throw new Error(error.message);
  }
};

router.use(cookieParser());

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await register(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const { token } = await login(username, password);
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    res.json({ success: true });
  } catch (error) {
    console.log('login error:', error.message);
    res.status(401).json({ message: error.message });
  }
});

router.get('/protected-route', authenticateToken, async (req, res) => {
  res.json({ success: true });
});

router.get('/user_info', authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await getUserInfo(id);
    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('authToken', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;