const express = require("express");
const app = express();
const {connectDB} = require("./config/server");
const User = require('./models/user');

connectDB()
  .then(() => {
    console.log("DB connection Successful");
    app.listen(3000, (req, res) => {
      console.log("Servcer is Listining on port 3000");
    });
  })
  .catch(() => console.log("DB connection failed"));

  app.use(express.json());


  app.post('/signup', async(req, res)=>{
    const users = new User();
    users.firstName = req?.body?.firstName;
    users.lastName = req?.body?.lastName;
    users.email = req?.body?.email;
    users.password = req?.body?.password;
    users.age = req?.body?.age;
    users.gender = req?.body?.gender;
    await users.save();
    res.send('User created Successfully');
  })
