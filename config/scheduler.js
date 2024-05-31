const cron = require('node-cron');
const syncClickCounts = require('../utils/syncClickCounts');

cron.schedule('0 * * * *', () => {
  console.log('Running syncClickCounts job...');
  syncClickCounts();
});

console.log('Scheduler initialized');
