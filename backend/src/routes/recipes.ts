import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get all recipes
router.get('/', (req, res) => {
  res.json(db.data.recipes);
});

// Add recipe (admin only)
router.post('/', (req, res) => {
  // For demo, allow anyone; in prod, authenticate admin
  const { name, ingredients, instructions, calories, protein, carbs, fats, tags } = req.body;
  const recipe = {
    id: Date.now().toString(),
    name,
    ingredients,
    instructions,
    calories,
    protein,
    carbs,
    fats,
    tags: tags || []
  };
  db.data.recipes.push(recipe);
  db.write();
  res.status(201).json(recipe);
});

// Search recipes
router.get('/search', (req, res) => {
  const query = req.query.q as string;
  const recipes = db.data.recipes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
  res.json(recipes);
});

export default router;