const mysql = require("mysql");
const util = require("util");
const dotnev = require("dotenv");

dotnev.config();

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

const query = util.promisify(connection.query.bind(connection));
connection.connect((err) => {
  if (err) {
    console.log("UNABLE TO CONNECT TO DB", err);
  } else console.log("DB CONNECTION ESTABLISHED");
});

module.exports = query;
