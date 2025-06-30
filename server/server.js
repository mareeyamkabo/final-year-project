const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { syncDatabase } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', require('./routes/itemRoutes'));

syncDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});
