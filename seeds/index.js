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
    for (let i = 0; i < 200; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const randPrice = Math.floor(Math.random() * 30 + 10)
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dzobpsfgj/image/upload/v1663690034/YelpCP/06212022_Spectacle-Lake-Alpine-Lakes-Wilderness_173_hslbv7.jpg',
                    filename: 'YelpCP/u97tteak8vxhnosamnzo'
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [cities[rand].longitude, cities[rand].latitude]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi illo distinctio ducimus optio nihil molestias quaerat corrupti vitae dolore unde, perspiciatis cumque nemo dolorum nulla laboriosam rem quasi ad facere.',
            price: randPrice,
            author: '6321dac96613cfde7de2f760'
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        console.log('Connection Closed');
        mongoose.connection.close();
    });