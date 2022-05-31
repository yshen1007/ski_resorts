const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { skiresortReview, reviewSchema } = require('./schemas.js');
const catchAsync = require('./catchAsync');
const ExpressError = require('./ExpressError');
const methodOverride = require('method-override');
const Skiresorts = require('./skiresorts');
const Review = require('./review');

mongoose.connect('mongodb://localhost:27017/ski-resorts');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/front', catchAsync(async (req, res) => {
    const skiresortss = await Skiresorts.find({});
    res.render('front/index', { skiresortss })
}));

app.get('/front/new', (req, res) => {
   res.render('front/new');
})

app.post('/front', catchAsync(async (req, res, next) => {
    const skiresortss = new Skiresorts(req.body.skiresortss);
    await skiresortss.save();
    res.redirect(`/front/${skiresortss._id}`)
}))

 app.get('/front/:id', catchAsync(async (req, res,) => {
    const skiresortss = await Skiresorts.findById(req.params.id).populate('reviews')
    res.render('front/show', { skiresortss });
}));

app.get('/front/:id/edit', catchAsync(async (req, res) => {
    const skiresortss = await Skiresorts.findById(req.params.id)
    res.render('front/edit', { skiresortss });
}))

app.put('/front/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const skiresortss = await Skiresorts.findByIdAndUpdate(id, { ...req.body.skiresortss });
    res.redirect(`/front/${skiresortss._id}`)
}));

app.delete('/front/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Skiresorts.findByIdAndDelete(id);
    res.redirect('/front');
}));

app.post('/front/:id/reviews', catchAsync(async (req, res) => {
    const skiresortss = await Skiresorts.findById(req.params.id);
    const review = new Review(req.body.review);
    skiresortss.reviews.push(review);
    await review.save();
    await skiresortss.save();
    res.redirect(`/front/${skiresortss._id}`);
}))

app.delete('/front/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Skiresorts.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/front/${id}`);
}))

app.listen(4000, () => {
    console.log('Serving on port 4000');
})