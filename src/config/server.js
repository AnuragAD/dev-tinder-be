const { MongoClient } = require("mongodb");

const mongoose = require("mongoose");
// const URI='mongodb+srv://MyCluster:mJZJUwIYfG9aVcTc@mycluster.4zb12wq.mongodb.net/'
// passwrod = 'mJZJUwIYfG9aVcTc';

const URI = "mongodb://localhost:27017/DevTinder";

const connectDB = async () => {
  await mongoose.connect(URI);
};

module.exports = {connectDB}

