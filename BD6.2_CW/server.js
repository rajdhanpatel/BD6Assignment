let { app } = require('./index.js');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
