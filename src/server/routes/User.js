import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import knex from '../config.js';

const router = express.Router();
const HostName = 'http://localhost:3000';

const getUsers = async (req, res) => {
  try {
    const users = await knex('users').select('user_id', 'username', 'profile_picture');
    res.json({ ok: true, users: users.map(user => ({
      ...user,
      profile_picture_url: `${HostName}/image/${user.profile_picture}`,
    })) });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
};
const countUsers = async (req, res) => {
  try {
    const count = await knex('users').count('user_id').first();
    res.json({ ok: true, count: count['count(`user_id`)'] });
    console.log(count);
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
};

router.get('/', authenticateToken, getUsers);
router.get('/count', authenticateToken, countUsers);

export default router;