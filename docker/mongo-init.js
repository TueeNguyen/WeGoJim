db = db.getSiblingDB('WeGoJim');
db.createCollection('Super_Users');
db.createCollection('Playlists');
db.Super_Users.insertOne({
  username: 'tue',
  password: 'superuserpassword',
});
