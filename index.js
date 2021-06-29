const express = require("express");
const middleware = require("./app/auth/middleware");
const cors = require("cors");

const app = express();

// routers
const userRouter = require("./app/routes/users");
const customerRouter = require("./app/routes/customers");
const designerRouter = require("./app/routes/member");
const porfolioRouter = require("./app/routes/portfolio");

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Files are served!" });
});

app
  .use(cors())
  .use(express.json({ limit: "10mb" }))
  .use(middleware)
  .use(userRouter)
  .use(customerRouter)
  .use(designerRouter)
  .use(porfolioRouter)
  .use((error, req, res, next) => {
    console.log("Error: ", error.status);
    res.status(error.status || 500).json({ error });
  });

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
