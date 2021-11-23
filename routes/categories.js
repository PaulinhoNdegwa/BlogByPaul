const router = require('express').Router();
const Category = require('../models/Category');

// Create category
router.post('/', async (req, res) => {
    try {
        if (req.body.name && req.body.name.length > 0) {
            const catFound = await Category.find({ name: req.body.name });
            if (!catFound.length > 0) {
                const category = new Category(req.body);
                const newCat = await category.save();
                res.status(201).json({
                    "message": "Category successfully created",
                    "category": newCat
                });
            } else {
                res.status(400).json({
                    "message": "Category name already exists",
                });
            }
        } else {
            res.status(400).json({
                "message": "You must provide a category name",
            });
        }

    } catch (error) {
        res.status(500).json({
            "message": "error creating new category",
            "error": error.message
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            "message": "Categories fetched successfully",
            "categories": categories
        });
    } catch (error) {
        res.status(500).json({
            "message": "error fetching categories",
            "error": error.message
        });
    }
})

module.exports = router;