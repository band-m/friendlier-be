const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./auth/passport');
const express = require('express');
const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/RESOURCE', require('./routes/resource'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
