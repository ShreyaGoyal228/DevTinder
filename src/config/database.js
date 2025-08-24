const mongoose = require("mongoose");
//connection string for the database inside the cluster nodejs(cluster) ---> devTinder(database)
const connectDb = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_URL);
};

module.exports = connectDb;
