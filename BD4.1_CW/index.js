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
    filename: './BD4.1_CW/database.sqlite',
    driver: sqlite3.Database,
  });
})();

// 1. Fetch all movies from db
async function fetchAllMoview() {
  let query = 'SELECT * from movies';
  let response = await db.all(query, []);
  return { movies: response };
}
app.get('/movies', async (req, res) => {
  try {
    let results = await fetchAllMoview();
    if (results.movies.length === 0) {
      return res.status(404).json({ message: 'No Movies Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Fetch movie by genre
async function fetchMovieByGenre(genre) {
  let query = 'select * from movies where genre=?';
  let response = await db.all(query, [genre]);
  return { movies: response };
}

app.get('/movies/genre/:genre', async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await fetchMovieByGenre(genre);
    if (result.movies.length === 0) {
      return res.status(404).json({ message: 'No Movies Found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Fetch some specific column by actor name
async function findByActor(actor) {
  let query =
    'SELECT id, title, actor, release_year FROM movies WHERE actor = ?';
  let response = await db.all(query, [actor]);
  return response;
}

app.get('/movies/actor/:actor', async (req, res) => {
  try {
    let actor = req.params.actor;
    let result = await findByActor(actor);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No movie exists' });
    }

    res.status(200).json({ movies: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all the movies by acotr with release year
///movies/year-actor?release_year=2016&actor=Aamir%20Khan
async function filterByActorAndYear(release_year, actor) {
  let query = 'select * from movies where release_year = ? and actor=?';
  let response = await db.all(query, [release_year, actor]);
  return { movies: response };
}
app.get('/movies/year-actor', async (req, res) => {
  try {
    let release_year = req.query.release_year;
    let actor = req.query.actor;
    let result = await filterByActorAndYear(release_year, actor);
    if (result.movies.length === 0)
      return res.status(404).json({ message: 'No movies found' });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log('server is running at port 3000'));
