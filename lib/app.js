const express = require('express');
const cors = require('cors');
const passport = require('passport');
const app = express();
require('./auth/passport');

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.cookieParser());
app.use(passport.initialize());
// app.use('/api/v1/RESOURCE', require('./routes/resource'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
