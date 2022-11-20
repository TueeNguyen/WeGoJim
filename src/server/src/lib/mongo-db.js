require('dotenv').config();
const { MongoClient } = require('mongodb');
const logger = require('../logger');

// Connection URL
const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const url = `mongodb://${username}:${password}@mongo:27017/admin?authSource=admin`;

const client = new MongoClient(url);
// Database Name
const dbName = 'WeGoJim';

let db = null;

module.exports.start = async function () {
  try {
    await client.connect();
    logger.info('Connected successfully to database');
    db = client.db(dbName);
    logger.info(`Switching to ${dbName} database`);
  } catch (err) {
    logger.error(err);
  }
};

// module.exports.createDefaultSuperUser = async function () {
//   try {
//     // Use connect method to connect to the server
//     await start();
//     const collection = db.collection('Super_Users');

//     // the following code examples can be pasted here...
//     await collection.insertOne({
//       name: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//     });
//   } catch (err) {
//     logger.error(err);
//   }
// };

// module.exports.findSuperUser = async function (username) {
//   try {
//     const collection = db.collection('Super_Users');
//     // the following code examples can be pasted here...
//     const super_user = collection.findOne({ name: `${username}` });
//     return super_user;
//   } catch (err) {
//     logger.error(err);
//   }
// };
