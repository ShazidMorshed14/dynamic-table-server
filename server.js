require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

//importing mongoDB connection function
const connecDB = require("./db/connect");

//importing the routes
const order_routes = require("./routes/order");
const column_routes = require("./routes/column");
const title_routes = require("./routes/title");

app.use("/orders", order_routes);
app.use("/columns", column_routes);
app.use("/titles", title_routes);

const start = async () => {
  try {
    await connecDB(process.env.MONGOURI);
    app.listen(PORT, () => {
      console.log(`app running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
