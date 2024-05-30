// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const db = require('../models/index')
const appConfig = require('../src/config');
const passport = require('../src/middleware/auth');
const loggingMiddleware = require('../src/middleware/logging');
const adminRoutes = require('../src/routes/adminRoutes');
const authRoutes = require('../src/routes/authRoutes');
const urlRoutes = require('../src/routes/urlRoutes');

const app = express();
const client = redis.createClient({ url: appConfig.redisUrl });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: new RedisStore({ client }),
  secret: appConfig.sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(loggingMiddleware); // Apply logging middleware

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', urlRoutes);

// Sync database and start server
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
    const PORT = appConfig.port;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database synchronization error:', err);
  });

module.exports = app;
