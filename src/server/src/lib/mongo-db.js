// getting-started.js
const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017');
  const UserModel = mongoose.model('User', new mongoose.Schema({ name: String }));
  const userDoc = new UserModel({ name: 'Foo' });
  await userDoc.save();
  const userFromDb = await UserModel.findOne({ name: 'Foo' });
  console.log(userFromDb);
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

main();
