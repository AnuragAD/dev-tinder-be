const express = require("express");
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/server");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}
));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DB connection Successful");
    app.listen(3000, (req, res) => {
      console.log("Servcer is Listining on port 3000");
    });
  })
  .catch(() => console.log("DB connection failed"));
