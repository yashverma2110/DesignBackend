const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userRouter = new express.Router();

userRouter.post("/user/signup", async (req, res) => {
  try {
    const hashedPass = crypto
      .createHash("md5")
      .update(req.body.password)
      .digest("hex");
    const qry = `INSERT INTO users SET ?`;
    const userDetails = [
      {
        ...req.body,
        password: hashedPass,
        roles: req.body.roles ?? "user",
      },
    ];
    const newUser = await req.query(qry, userDetails);
    const token = jwt.sign(
      { email: userDetails.email, roles: userDetails.roles },
      "s@c%r$T"
    );
    delete userDetails.password;
    res.json({ message: "Signed up successfully", user: userDetails, token });
  } catch (error) {
    console.log(error.message);
    if (error.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Email already exists" });
    res.status(500).json({ message: "Unable to signup" });
  }
});

userRouter.post("/user/login", async (req, res) => {
  try {
    const hashedPass = crypto
      .createHash("md5")
      .update(req.body.password)
      .digest("hex");
    const userDetails = await req.query(
      `SELECT * FROM users WHERE email='${req.body.email}' AND password='${hashedPass}'`
    );

    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({ message: "Check your email or password" });
    }
    const token = jwt.sign(
      { email: userDetails[0].email, roles: userDetails.roles },
      "s@c%r$T"
    );

    delete userDetails.password;
    res.json({ user: userDetails, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// to get users with a pirticular roles
userRouter.get("/user/:role", async (req, res) => {
  try {
    const users = await req.query(`SELECT * FROM users WHERE roles=?`, [
      req.params.role,
    ]);

    res.json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Some error occured" });
  }
});

// to get all users
userRouter.get("/users/getAll", async (req, res) => {
  try {
    if (!req.user.roles.includes("superadmin"))
      return res.status(401).json({ message: "Unauthorised" });

    const users = await req.query(`SELECT * FROM users`);

    res.json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Some error occured" });
  }
});

// api to update users
userRouter.put("/user", async (req, res) => {
  try {
    if (!req.user.roles.includes("superadmin")) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    await req.query(`UPDATE users SET ? WHERE id='${req.body.id}'`, req.body);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Some error occured" });
  }
});

//api to delete user
userRouter.delete("/user/:id", async (req, res) => {
  try {
    if (!req.user.roles.includes("superadmin")) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    await req.query(`delete from users where id=${req.params.id}`);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

module.exports = userRouter;
