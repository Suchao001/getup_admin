import express from 'express';
import knex from '../config.js';
import authenticateToken from '../middleware/authenticateToken.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

router.use(cookieParser());

router.get('/category', async (req, res) => {
  try {
    const habitsCategory = await knex('habit_category').select('*');
    res.json({ ok: true, habitsCategory });
  } catch (error) {
    console.error('Error fetching habits category:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const habits = await knex('habit_recommendation').join('icons', 'habit_recommendation.icon_id', '=', 'icons.id').join('habit_category', 'habit_recommendation.category_id', '=', 'habit_category.id')
      .where('habit_recommendation.category_id', req.params.id)
      .select(
        'habit_recommendation.name',
        'habit_recommendation.icon_id',
        'icons.nameTouse as nameToUse',
        'icons.id as icon_id',
        'habit_category.color'
      );
      
    res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});


export default router;
