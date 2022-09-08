const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./helpers');

mongoose.connect('mongodb://localhost:27017/yelp-cp')
    .then(() => {
        console.log("Connection Opened!");
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    })

function sample(arr) {
    rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const randPrice = Math.floor(Math.random() * 30 + 10)
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi illo distinctio ducimus optio nihil molestias quaerat corrupti vitae dolore unde, perspiciatis cumque nemo dolorum nulla laboriosam rem quasi ad facere.',
            price: randPrice
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        console.log('Connection Closed');
        mongoose.connection.close();
    });