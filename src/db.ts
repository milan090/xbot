import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  if (!process.env.MONGO_URI) {
    throw new Error("No Database URL provided for MongoDB connection");
  }
  mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    }
  );

  const db: mongoose.Connection = mongoose.connection;

  db.on("error", (error) => console.error(error));
  db.once("open", () => {
    console.log("Connected to MongoDB Database");
    db.db.command({ connectionStatus: 1 }, (err, result) => {
      console.log(JSON.stringify(result));
      // mongoose.disconnect()
    });
  });
};
