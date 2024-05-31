const cron = require('node-cron');
const syncClickCounts = require('../utils/syncClickCounts');

cron.schedule('0 * * * *', () => {
  console.log('\nRunning syncClickCounts job...');
  syncClickCounts();
  console.log('\nsyncClickCounts job finished.'); 
});

console.log('\nScheduler initialized');
