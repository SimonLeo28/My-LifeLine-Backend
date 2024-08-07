const mongoose = require("mongoose")
require('dotenv').config();


async function JournalDB()   
{
    await mongoose.connect(process.env.MONGO_URI) //async function look into notepad async convert to sync using await
    console.log("Connected to database.")
}

module.exports = JournalDB
