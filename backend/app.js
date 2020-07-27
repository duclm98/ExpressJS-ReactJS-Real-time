const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/categories', require('./category.route'));

require('./ws');

// SSE
const sse = require('./sse');
app.get('/categoryAddedEvent', sse.subscribeCategoryAdded);

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`API is running at http://localhost:${PORT}`);
})