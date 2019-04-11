// build the database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// the timestamps, just creates a timestamp when the object has been created
const urlSchema = new Schema({
    originalUrl: String,
    shorterUrl: String
}, {timestamps: true});

const ModelClass = mongoose.model('shortUrl', urlSchema); //pass in the table name/collection and the structure -- basic setup

module.exports = ModelClass; //allows node.js to access this