require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');
const path = require('path');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use routes
app.use('/api/auth', authRoutes);

// Serve static frontend files
app.use(express.static(path.resolve(__dirname, '../')));



// MongoDB connection
const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/sentry-scan';
console.log("mongo uri is here==>", mongoUrl);


mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

