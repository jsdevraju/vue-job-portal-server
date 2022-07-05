import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Connected With MongoDb
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Server Db Connected`);
  });

app.listen(PORT, () => {
  console.log(`Server Listing Port ${PORT}`);
});
