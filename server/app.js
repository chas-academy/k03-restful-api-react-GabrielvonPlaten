require('dotenv').config()
require('./db/server');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const UserRoutes = require('./routes/User');
const ProductRoutes = require('./routes/Product');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Use Routes
app.use(ProductRoutes);
app.use(UserRoutes);

if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/dist/'));

  // Handle Single Page Application
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/dist/index.html'));
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('App listening on port ' + port);
});