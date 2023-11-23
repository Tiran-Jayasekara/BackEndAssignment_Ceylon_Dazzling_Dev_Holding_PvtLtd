const express = require("express");
const database = require("./database/database");
const app = express();
const port = 3002;

//cors allows you to configure your server to explicitly allow requests from specific domains.
var cors = require("cors");
app.use(express.json());
app.use(cors());
app.options("*", cors());

// Make connection with user.js file inside routes folder
const UserRouter = require("./routes/user");
app.use("/users", UserRouter);

// calling database() method for create Connection with MongoDB database
//Run API in port
database()
  .then(() => {
    app.listen(port, () => {
      console.log(`Node JS app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application on database connection failure
  });
