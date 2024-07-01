import express from "express";
import dotenv from "dotenv";
import dbConnection from "./database/dbConfig.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

dotenv.config();
dbConnection();

const app = express();
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

//api
app.get("/", (req, res) => {
  res.status(200).json({ message: "i am comming from backend" });
});

app.use("/api/v1/user", userRoute);

//port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port : ${process.env.PORT}`);
});
