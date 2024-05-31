// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const db = require('../models/index');
const passport = require('../src/middleware/auth');
const loggingMiddleware = require('../src/middleware/logging');
const adminRoutes = require('../src/routes/adminRoutes');
const authRoutes = require('../src/routes/authRoutes');
const urlRoutes = require('../src/routes/urlRoutes');

const app = express();
const client = redis.createClient({ url: process.env.REDIS_URL });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: new RedisStore({ client }),
  secret: process.env.SESSION_SECRET,
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
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database synchronization error:', err);
  });

module.exports = app;
