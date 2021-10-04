const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MDB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongo DB connected.")
    } catch (error) {
        console.error(error);
        //Exit process with failure
        process.exit();
    }
}

module.exports = connectDB;