const express = require("express");

const memberRouter = new express.Router();

memberRouter.get("/designer/getAll", async (req, res) => {
  try {
    const data = await req.query(
      `SELECT * FROM designers WHERE role="Designer"`
    );
    res.json({ designers: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

memberRouter.get("/team/getAll", async (req, res) => {
  try {
    const data = await req.query(
      `SELECT * FROM designers WHERE role="Team Member"`
    );
    res.json({ team: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

memberRouter.post("/designer/add", async (req, res) => {
  try {
    if (
      !(
        req?.user?.roles.includes("superadmin") ||
        req?.user?.roles.includes("Site Admin")
      )
    )
      return res.status(401).json({ message: "You don't have the privileges" });

    await req.query(`INSERT INTO designers SET ?`, {
      ...req.body,
    });

    res.json({ message: "Designer added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to add designer" });
  }
});

//api to delete designer
memberRouter.delete("/designer/delete/:id", async (req, res) => {
  try {
    if (
      !(
        req.user.roles.includes("superadmin") ||
        req.user.roles.includes("Site Admin")
      )
    ) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    await req.query(`delete from designers where id=${req.params.id}`);

    res.json({ message: "Designer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

//api to delete team
memberRouter.delete("/team/delete/:id", async (req, res) => {
  try {
    if (
      !(
        req.user.roles.includes("superadmin") ||
        req.user.roles.includes("Site Admin")
      )
    ) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    await req.query(`delete from designers where id=${req.params.id}`);

    res.json({ message: "Designer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

module.exports = memberRouter;
