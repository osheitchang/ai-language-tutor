const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authmiddleware');

// Get all lessons for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.lessons);
    } catch (err) {
        console.error('Error retrieving lessons:', err);
        res.status(500).json({ message: 'Error retrieving lessons' });
    }
});

// Update lesson progress
router.post('/progress', authMiddleware, async (req, res) => {
    const { lesson_id, score } = req.body;

    try {
        const user = await User.findById(req.user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const lesson = user.lessons.find(lesson => lesson.lesson_id === lesson_id);

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        lesson.completed = true;
        lesson.score = score;

        await user.save();
        res.json({ message: 'Progress updated successfully' });
    } catch (err) {
        console.error('Error updating progress:', err);
        res.status(500).json({ message: 'Error updating progress' });
    }
});

module.exports = router;
