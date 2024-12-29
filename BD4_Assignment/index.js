let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3');
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './BD4_Assignment/database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Exercise 1: Get All Restaurants

async function fetchAllResturants() {
  let query = 'select * from restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}
app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllResturants();
    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No Restaurants Found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(505).json({ error: error.message });
  }
});

//Exercise 2: Get Restaurant by ID
// /restaurants/details/1

async function fetchById(id) {
  let query = 'select * from restaurants where id=?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchById(id);
    if (result.restaurants.length === 0) {
      res.status(404).json({ messsage: 'No Restaurant Found by id: ' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 3: Get Restaurants by Cuisine
// /restaurants/cuisine/:cuisine
// eg. /restaurants/cuisine/Indian

async function fetchByCuisine(cuisine) {
  let query = 'select * from restaurants where cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await fetchByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurants Found by Cuisine: ' + cuisine });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 4: Get Restaurants by Filter
// /restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false

async function filterResturantes(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'select * from restaurants where isVeg=? and hasOutdoorSeating=? and isLuxury=?';
  let result = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: result };
}
app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let response = await filterResturantes(isVeg, hasOutdoorSeating, isLuxury);
    if (response.restaurants.length === 0) {
      res.status(404).json({
        message:
          'No Restaurants Found by isVeg: ' +
          isVeg +
          ',' +
          ' hasOutdoorSeating: ' +
          hasOutdoorSeating +
          ' isLuxury: ' +
          isLuxury,
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 5: Get Restaurants Sorted by Rating  ( highest to lowest )
// /restaurants/sort-by-rating
async function sortByRatingDesc() {
  let query = 'select * from restaurants order by rating desc';
  let response = await db.all(query, []);
  return { restaurants: response };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await sortByRatingDesc();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 6: Get All Dishes
// /dishes
async function fetchAllDishes() {
  let query = 'select * from dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}
app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      res.status(404).json({ message: 'No Dishes Found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(505).json({ error: error.message });
  }
});

//Exercise 7: Get Dish by ID
// /dishes/details/1
async function fetchById(id) {
  let query = 'select * from dishes where id=?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}
app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchById(id);
    if (result.dishes.length === 0) {
      res.status(404).json({ messsage: 'No Dishes Found by id: ' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 8: Get Dishes by Filter
// /dishes/filter?isVeg=true

async function filterDishes(isVeg) {
  let query = 'select * from dishes where isVeg=?';
  let result = await db.all(query, [isVeg]);
  return { dishes: result };
}
app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let response = await filterDishes(isVeg);
    if (response.dishes.length === 0) {
      res.status(404).json({
        message: 'No Dishes Found by isVeg: ' + isVeg,
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 9: Get Dishes Sorted by Price lowest to highest
// /dishes/sort-by-price
async function sortByPriceAsc() {
  let query = 'select * from dishes order by price';
  let response = await db.all(query, []);
  return { dishes: response };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await sortByPriceAsc();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log('server is running at port 3000'));
