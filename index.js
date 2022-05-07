const mongoose = require('mongoose');
const information = require('./information');
const Skiresorts = require('./skiresorts');

mongoose.connect('mongodb://localhost:27017/ski-resorts');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const resortsDB = async () => {
    await Skiresorts.deleteMany({});
    for (let i = 0; i < 26; i++) {
        const ski = new Skiresorts({
            location: `${information[i].country}`,
            title: `${information[i].name}`
        })
        await ski.save();
    }
}

resortsDB().then(() => {
    mongoose.connection.close();
})