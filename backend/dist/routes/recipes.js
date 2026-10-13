"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// Get all recipes
router.get('/', (req, res) => {
    res.json(db_1.db.data.recipes);
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
    db_1.db.data.recipes.push(recipe);
    db_1.db.write();
    res.status(201).json(recipe);
});
// Search recipes
router.get('/search', (req, res) => {
    const query = req.query.q;
    const recipes = db_1.db.data.recipes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
    res.json(recipes);
});
exports.default = router;
