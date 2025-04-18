const mongoose = require('mongoose')

//Define the schema for the User model

const userSchema = new mongoose.Schema({
    email: {type: String, required: true,  unique: true},
    password: {type: String, required: true},
    lessons: [{
        lesson_id: {Number},
        lesson_name: {String},
        content: {type:String, required: true}, //e.g., Lesson text or video URL
        completed: {type: Boolean, default: false},
        score: {type: Number, default: 0},
        type: {type: String, enum: ['text', 'video', 'quiz'], required: true}
    }]
});


// Create and export model

const User = mongoose.model('User', userSchema);

module.exports = User;