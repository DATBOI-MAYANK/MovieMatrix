import "dotenv/config";
import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const ConnectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/MovieMatrix`,
    );
    console.log(
      `\n MongoDB Host connected !! DB Host : ${ConnectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default ConnectDB;
