const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');


const authRoutes = require('./routes/auth');
const seatRoutes = require('./routes/seats');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);


pool.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit the process if the connection fails
    } else {
        console.log("Database connected successfully 🔥");
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
