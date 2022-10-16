const { MongoClient } = require('mongodb');
const logger = require('../logger');
require('dotenv').config();
// or as an es module:

// Connection URL
const url = 'mongodb://mongo:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'WeGoJim';

let db = null;

async function start() {
  try {
    await client.connect();
    logger.info('Connected successfully to server');
    db = client.db(dbName);
  } catch (err) {
    logger.error(err);
  }
}

module.exports.createDefaultSuperUser = async function () {
  try {
    // Use connect method to connect to the server
    await start();
    const collection = db.collection('Super_Users');

    // the following code examples can be pasted here...
    await collection.insertOne({
      name: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
  } catch (err) {
    logger.error(err);
  }
};

module.exports.findSuperUser = async function (username) {
  try {
    const collection = db.collection('Super_Users');
    // the following code examples can be pasted here...
    const super_user = collection.findOne({ name: `${username}` });
    return super_user;
  } catch (err) {
    logger.error(err);
  }
};
