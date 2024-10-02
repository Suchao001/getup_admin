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
        'habit_category.color',
        'habit_recommendation.id'
      );
      
    res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.post('/category',authenticateToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    await knex('habit_category').insert({ name, color });
    res.json({ ok: true, message: 'Habit category added successfully' });
  } catch (error) {
    console.error('Error adding habit category:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});
router.put('/category',authenticateToken, async (req, res) => {
  try {
    const { id, name, color } = req.body;
    await knex('habit_category').where('id', id).update({ name, color });
    res.json({ ok: true, message: 'Habit category updated successfully' });
  } catch (error) {
    console.error('Error updating habit category:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.put('/habitRecommendation',authenticateToken, async (req, res) => {
  try {
    const { id, name, icon_id } = req.body;
    await knex('habit_recommendation').where('id', id).update({ name, icon_id });
    res.json({ ok: true, message: 'Habit recommendation updated successfully' });
  } catch (error) {
    console.error('Error updating habit recommendation:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.post('/habitRecommendation',authenticateToken, async (req, res) => {
  try {
    const { name, icon_id, categoryId } = req.body;
    await knex('habit_recommendation').insert({ name, icon_id, category_id: categoryId });
    res.json({ ok: true, message: 'Habit recommendation added successfully' });
  } catch (error) {
    console.error('Error adding habit recommendation:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.delete('/habitRecommendation/:id',authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await knex('habit_recommendation').where('id', id).del();
    res.json({ ok: true, message: 'Habit recommendation deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit recommendation:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.delete('/habitCategory/:id',authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await knex('habit_category').where('id', id).del();
    res.json({ ok: true, message: 'Habit category deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit category:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});


export default router;
