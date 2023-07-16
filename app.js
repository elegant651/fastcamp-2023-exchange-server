const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const corsOptions = {
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./api')(app);

app.listen(4000, () => console.log('Server started on port 4000'));