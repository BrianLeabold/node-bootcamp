const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection succesful'));

//Read file to import data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// Import data function
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tour data imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// Delete existing data in DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data was deleted');
  } catch (err) {
    console.log(`Opps: ${err}`);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
