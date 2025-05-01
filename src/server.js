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
const PORT = process.env.PORT || 4000;

// Debugging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Basic security headers
app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// CORS middleware with more permissive settings
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

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
    serverSelectionTimeoutMS: 4000
})
.then(() => console.log('Connected successfully!'))
.catch(err => {
    console.error('Connection failed with error:', err.message);
    console.error('Full error:', err);
});

// Root route with explicit headers
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});