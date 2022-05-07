const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Skiresorts = require('./skiresorts');

mongoose.connect('mongodb://localhost:27017/ski-resorts');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/front', async (req, res) => {
    const skiresortss = await Skiresorts.find({});
    res.render('front/index', { skiresortss })
});
app.get('/front/new', (req, res) => {
   res.render('front/new');
})
app.get('/front/reviews', (req, res) => {
    res.render('front/reviews');
 })

app.listen(4000, () => {
    console.log('Serving on port 4000');
})