const mongoose = require('mongoose');

// loads configuration in .env to process object
require('dotenv').config();

const connectWithDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            dbName: "planitDB",
        })
        console.log("DB connection established");
    }
    catch(error) {
        console.log("Error connecting to database");
        console.error(error);
    }
}

module.exports = connectWithDb;