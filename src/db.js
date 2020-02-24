const { MongoClient } = require('mongodb');
const logger = require('./utils/logger');

module.exports = MongoClient.connect(process.env.MONGO_URL)
  .then((client) => client.db(process.env.DB_NAME))
  .catch((e) => {
    logger.error('Failed to connect to MongoDB', e);
    process.exit(1);
  });
