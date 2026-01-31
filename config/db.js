const mongoose = require('mongoose');
// MongoDB Connection Logic
// Tutorial: https://www.youtube.com/watch?v=W5TEy7i6f_S (Mongoose Connection Guide)
// Source: https://mongoosejs.com/docs/connections.html
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;