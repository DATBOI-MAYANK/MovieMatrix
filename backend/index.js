import "dotenv/config";
import ConnectDB from "./Database/database.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 8000;

ConnectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`App is listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection Failed !! ERROR:", error);
  });
