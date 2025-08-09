const mongoose = require("mongoose");
//connection string for the database inside the cluster nodejs(cluster) ---> devTinder(database)
const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://goyalshreya228:2DOtGR3BSeFpi678@nodejs.uswttqr.mongodb.net/devTinder"
  );
};

module.exports=connectDb