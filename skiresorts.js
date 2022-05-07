const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const SkiresortsSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    review: String
});

module.exports = mongoose.model('Skiresorts', SkiresortsSchema);