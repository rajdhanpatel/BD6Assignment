const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let reviews = [
  { id: 1, content: 'Great Production', userId: 1 },
  { id: 2, content: 'Not bad, could be better', userId: 2 },
];

let users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

async function getAllReviews() {
  return reviews;
}
app.get('/reviews', async (req, res) => {
  const reviews = await getAllReviews();
  res.json(reviews);
});

async function getReviewById(id) {
  return reviews.find((obj) => obj.id === id);
}
app.get('/reviews/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const review = await getReviewById(id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  res.status(201).json(review);
});
async function addReview(dataBody) {
  const review = {
    id: reviews.length + 1,
    content: dataBody.content,
    userId: dataBody.userId,
  };
  reviews.push(review);
  return review;
}
app.post('/reviews/new', async (req, res) => {
  const newReview = await addReview(req.body);
  res.status(201).json(newReview);
});

async function getUserById(id) {
  return users.find((obj) => obj.id === id);
}
app.get('/users/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(201).json(user);
});

async function addUser(userBody) {
  const user = {
    id: users.length + 1,
    name: userBody.name,
    email: userBody.email,
  };
  users.push(user);
  return user;
}
app.post('/users/new', async (req, res) => {
  const newUser = await addUser(req.body);
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
  app,
  getAllReviews,
  addReview,
  getReviewById,
  addUser,
  getUserById,
};

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}
