const express = require("express");
const db = require("./db");
const restaurant = require("./restaurantModel");

const app = express();
const PORT = 3001;

app.use(express.json());


db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

app.get('/restaurants', async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;
  
    try {
      const restaurants = await restaurant.find()
        .skip(skip)
        .limit(parseInt(pageSize))
        .exec();
  
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/restaurants/sorted-by-rating', async (req, res) => {
    try {
      const sortedRestaurants = await restaurant.aggregate([
        {
          $lookup: {
            from: 'reviews',
            localField: 'name',
            foreignField: 'restaurantId',
            as: 'reviewDetails',
          },
        },
        {
          $addFields: {
            averageRating: { $avg: '$reviewDetails.rating' },
          },
        },
        {
          $sort: { averageRating: -1 },
        },
      ]).exec();
  
      res.json(sortedRestaurants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
