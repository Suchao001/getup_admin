import express from 'express';
import knex from '../config.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/id/:id?', async (req, res) => {
    try {
        const iconId = req.params.id;

        if (iconId) {
            const icon = await knex('icons')
                .where({ id: iconId })
                .first();
            if (icon) {
                res.status(200).json(icon);
            } else {
                res.status(404).json({ error: 'Icon not found' });
            }
        } else {
            const icons = await knex('icons').select();
            res.status(200).json(icons);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const icons = await knex('icons')
            .join('icon_category', 'icons.category_id', '=', 'icon_category.id')
            .select('icons.id', 'icons.name', 'icons.nameTouse', 'icon_category.category_name', 'icons.category_id as category_id');
        res.status(200).json(icons);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/category', async (req, res) => {
    try {
        const icons = await knex('icon_category').select();
        res.status(200).json(icons);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, nameTouse, category_id } = req.body;
        const [newIconId] = await knex('icons').insert({ name, nameTouse, category_id }).returning('id');
        const newIcon = await knex('icons').where({ id: newIconId }).first();
        res.status(201).json(newIcon);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/name/:name', authenticateToken, async (req, res) => {
    try {
        const iconName = req.params.name;
        await knex('icons').where({ name: iconName }).del();
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const iconId = req.params.id;
        const { name, nameTouse, category_id } = req.body;
        await knex('icons').where({ id: iconId }).update({ name, nameTouse, category_id });
        const updatedIcon = await knex('icons').where({ id: iconId }).first();
        res.status(200).json(updatedIcon);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default router;