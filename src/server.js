const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')
const practiceRoutes = require('./routes/practice')
const lessonRoutes = require('./routes/lessons')


// Add these debug lines
console.log('Current directory:', __dirname);
console.log('Environment variables loaded:', !!process.env.MONGODB_URI);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Defined' : 'Not defined');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //For parsinga pplication/json
app.use(express.urlencoded({extended:true})); //For parsing application/x-www-form-urleconded

app.use('/api/auth', authRoutes)
app.use('/api/practice', practiceRoutes)
app.use('/api/lessons', lessonRoutes)


// Add these debug lines at the top
console.log('Attempting connection with URI:', 
    process.env.MONGODB_URI.replace(/\/\/.*?@/, '//<credentials>@'));

// Try with explicit options
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected successfully!'))
.catch(err => {
    console.error('Connection failed with error:', err.message);
    console.error('Full error:', err);
});

app.get('/', (req,res,next)=> {
    res.send('Hello World!');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});