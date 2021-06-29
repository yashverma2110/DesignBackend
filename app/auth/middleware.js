const query = require("../db/database");
const jwt = require("jsonwebtoken");

const middleware = async (req, res, next) => {
  // function to execute raw sql query
  req.query = query;

  // login and signup urls require no authentication
  if (
    req.url === "/user/login" ||
    req.url === "/user/signup" ||
    req.url === "/customer/enquire" ||
    req.url === "/designer/getAll" ||
    req.url === "/team/getAll" ||
    req.url === "/customer/testimonial/getAll" ||
    req.url.includes("/portfolio/getAll") ||
    (req.url.includes("/portfolio/images") && req.method === "GET")
  ) {
    return next();
  }

  let token = req.headers["authorization"];

  try {
    if (token) {
      if (token.startsWith("Bearer ")) token = token.split(" ")[1];
      const decoded = jwt.verify(token, "s@c%r$T");
      const user = await req.query(
        `SELECT * FROM users WHERE email='${decoded.email}'`
      );
      req.user = user[0];
      return next();
    } else {
      return res.status(401).json({
        message: "Auth token is not supplied",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

module.exports = middleware;
