require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Log environment variables for debugging
console.log('Mongo URI:', process.env.MONGO_URL);
console.log('Port:', process.env.PORT);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/user', userRoutes);

app.set('view engine', 'ejs');

// Serve static files (e.g., EJS views)
app.use(express.static('views'));

const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.post('/user/upload', upload.single('image'), (req, res) => {
    res.json({ file: req.file });
});



// Use PORT from .env file
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
























// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const path = require('path');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();

// console.log('Mongo URI:', process.env.MONGO_URL);


// mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// app.use(bodyParser.json());
// app.use('/uploads', express.static('uploads'));
// app.use('/user', userRoutes);

// app.set('view engine', 'ejs');

// app.listen(3000, () => console.log('Server running on port 3000'));
