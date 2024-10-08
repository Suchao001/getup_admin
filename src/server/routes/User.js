import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import knex from '../config.js';

const router = express.Router();
const HostName = 'http://localhost:3000';

const getUsers = async (req, res) => {
  try {
    const users = await knex('users').select('user_id', 'username', 'profile_picture', 'is_active');
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

const toggleUserStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await knex('users').where('user_id', user_id).first();
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }
    const updatedUser = await knex('users').where('user_id', user_id).update({ is_active: !user.is_active });
    res.json({ ok: true, message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
};

router.get('/', authenticateToken, getUsers);
router.get('/count', authenticateToken, countUsers);
router.put('/:user_id', authenticateToken, toggleUserStatus);

export default router;