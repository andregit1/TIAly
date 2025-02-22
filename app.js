require('dotenv').config(); // Initialize dotenv
require('./config/scheduler'); // Initialize scheduler

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require('./config/ioredis');
const RedisStore = require('connect-redis').default;
const db = require('./models/index');
const passport = require('./middleware/auth');
const loggingMiddleware = require('./middleware/logging');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');

// Import Swagger packages
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize
const app = express();

redis.on('connect', function () {
  console.log('\nRedis client connected');
});

redis.on('error', function (err) {
  console.error('\nRedis error:', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(loggingMiddleware); // Apply logging middleware
// app.use(cors()); // Use cors middleware
app.use(cors({
  origin: 'http://localhost:3000' // Allow only this origin to access the server
}));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TIAly',
      version: '1.0.0',
      description: 'URL shortener',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', urlRoutes);

// Sync database and start server
db.sequelize.sync({ force: false, logging: (msg) => console.log(`${msg}\n`) })
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
