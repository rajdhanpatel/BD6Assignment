let express = require('express');
let { track } = require('./models/track.model');
let { sequelize } = require('./lib/index');
const { parse } = require('querystring');
let app = express();

app.use(express.json());

let movieData = [
  {
    name: 'Raabta',
    genre: 'Romantic',
    release_year: 2012,
    artist: 'Arjit Singh',
    album: 'Agent Vindo',
    duration: 4,
  },
  {
    name: 'Krish',
    genre: 'Romantic',
    release_year: 2010,
    artist: 'Sunidhi Chauhan',
    album: 'Agent Vindo',
    duration: 5,
  },
  {
    name: 'Kabhi Khusi Kabhi Gum',
    genre: 'Fight',
    release_year: 2004,
    artist: 'Sonu Nigam',
    album: 'SRK',
    duration: 2,
  },
  {
    name: 'Pardesh',
    genre: 'Horror',
    release_year: 1998,
    artist: 'Kumar Sanu',
    album: 'Dharma',
    duration: 1,
  },
  {
    name: 'Bhool Bhulaiya 3',
    genre: 'Horror',
    release_year: 2024,
    artist: 'KK',
    album: 'T Series',
    duration: 5,
  },
  {
    name: 'Jawan',
    genre: 'Action',
    release_year: 2022,
    artist: 'Sadhan Sargam',
    album: 'SRK',
    duration: 5,
  },
  {
    name: 'Tiger Jinda hai  3',
    genre: 'Action & Romance',
    release_year: 2023,
    artist: 'KK',
    album: 'Hunt',
    duration: 3,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await track.bulkCreate(movieData);
    res.status(200).json({ message: 'Database Seeding success' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

// BD5.2_CW
// 1. find all track
async function fetchAllTrack() {
  let tracks = await track.findAll();
  return { tracks };
}

app.get('/track', async (req, res) => {
  try {
    let response = await fetchAllTrack();
    if (response.tracks.length === 0) {
      return res.status(404).json({ message: 'No Tracks found' });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. find all track by id
async function fetchById(id) {
  let trackData = await track.findOne({ where: { id } });
  return { track: trackData };
}

app.get('/tracks/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchById(id);
    if (result.track === null) {
      res.status(404).json({ message: 'No Data found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. fetch track by artist

async function fetchByArtist(artist) {
  let trackData = await track.findAll({ where: { artist } });
  return { track: trackData };
}

app.get('/tracks/artist/:artist', async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await fetchByArtist(artist);
    if (result.track.length === 0) {
      res.status(404).json({ message: 'No Data found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. sort tracks by release_year in asc and desc order
async function sortTrckByReleaseYear(order) {
  let result = await track.findAll({ order: [['release_year', order]] });
  return { track: result };
}

app.get('/tracks/sort/release_year', async (req, res) => {
  try {
    let orderedData = req.query.order;
    let response = await sortTrckByReleaseYear(orderedData);
    if (response.track.length === 0) {
      return res.status(404).json({ message: 'No track found' });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------BD5.3_CW-------------------
// 1. create a POST API like create some more tracks in db table

async function addNewTrack(newTrackPayloadBody) {
  let response = await track.create(newTrackPayloadBody);
  return { response };
}

app.post('/track/new', async (req, res) => {
  try {
    let newTrackPayloadBody = req.body.newTrack;
    let result = await addNewTrack(newTrackPayloadBody);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//2. update the particular details

async function updateTrackById(bodyPayload, id) {
  let trackDetails = await track.findOne({ where: { id } });
  if (!trackDetails) {
    return {};
  }
  trackDetails.set(bodyPayload); // update the body payload

  // now save in db
  let updatedBodyPayload = await trackDetails.save();
  return {message: "Track updated successfully", updatedBodyPayload}
}
app.post('/track/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let requestBodyPayload = req.body;
    let response = await updateTrackById(requestBodyPayload, id);
    if(!response.message){
      return res.status(404).json(message: "Track not found");
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. delete track by id
async function deleteTrackById(id){
  let destroyTrack = await track.destroy({where: {id}});
  if(destroyTrack ===0) return {}
  return {message: "track record deleted successfully"}
}
app.post("/track/delete/:id", async (req, res)=>{
  try{
    let id = parseInt(req.params.id);
    let response = await deleteTrackById(id);
    if(!response.message){
      res.status(404).json({message: "track not found"})
    }
    return res.status(200).json(response)
  }catch(error){
    res.status(500).json({error:error.message})
  }
})

// -----------------------------BD5.4_CW-----------------------------

// 1. create a api to create an user
async function addNewUser(newUser){
  let newDate = await user.create(newUser);
  return {newDate};
}

app.post("/user/ new", async (req, res)=>{
  try{
    let newUser = req.body.newUser;
    let response = await addNewUser(newUser);

    return res.status(200).json(response);
  }catch(error){
    res.status(500).json({error:error.message})
  }
})

// 2. update a user based on id

app.post("/user/update/:id")

// ----------listen server on port 3000---------------
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
