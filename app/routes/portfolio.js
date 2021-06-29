const express = require("express");

const porfolioRouter = new express.Router();

porfolioRouter.get("/portfolio/getAll/:getImages?", async (req, res) => {
  try {
    const data = await req.query(`SELECT * FROM portfolio`);

    if (req.params.getImages === "true") {
      for (var index = 0; index < data.length; index++) {
        const images = await req.query(
          `SELECT * FROM image_links WHERE parent=${data[index].id} ORDER BY pos ASC`
        );

        data[index].images = images;
      }

      res.json({ portfolio: data });
    } else {
      res.json({ portfolio: data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

porfolioRouter.get("/portfolio/images/:id", async (req, res) => {
  try {
    const data = await req.query(
      `SELECT * FROM image_links WHERE parent=${req.params.id} ORDER BY pos ASC`
    );
    res.json({ images: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

porfolioRouter.post("/portfolio/add", async (req, res) => {
  try {
    if (
      !(
        req?.user?.roles.includes("superadmin") ||
        req?.user?.roles.includes("Site Admin")
      )
    )
      return res.status(401).json({ message: "You don't have the privileges" });

    await req.query(`INSERT INTO portfolio SET ?`, {
      ...req.body,
    });

    res.json({ message: "Category added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to add portfolio" });
  }
});

porfolioRouter.post("/portfolio/image/add", async (req, res) => {
  try {
    if (
      !(
        req?.user?.roles.includes("superadmin") ||
        req?.user?.roles.includes("Site Admin")
      )
    )
      return res.status(401).json({ message: "You don't have the privileges" });

    const pos = await req.query(
      `select MAX(pos) from image_links WHERE parent=${req.body.parent}`
    );

    await req.query(`INSERT INTO image_links SET ?`, {
      ...req.body,
      pos: pos[0]["MAX(pos)"] !== null ? pos[0]["MAX(pos)"] + 1 : 0,
    });

    res.json({ message: "Image added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to add portfolio" });
  }
});

porfolioRouter.put("/portfolio/order", async (req, res) => {
  try {
    if (
      !(
        req?.user?.roles.includes("superadmin") ||
        req?.user?.roles.includes("Site Admin")
      )
    )
      return res.status(401).json({ message: "You don't have the privileges" });

    req.body.images.forEach(async (img) => {
      await req.query(
        `UPDATE image_links SET pos=${img.pos} WHERE id=${img.id}`
      );
    });

    res.json({ message: "Image added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to change portfolio" });
  }
});

//api to delete portfolio
porfolioRouter.delete("/portfolio/:id", async (req, res) => {
  try {
    if (
      !(
        req.user.roles.includes("superadmin") ||
        req.user.roles.includes("Site Admin")
      )
    ) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    await req.query(`delete from portfolio where id=${req.params.id}`);

    res.json({ message: "portfolio deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

//api to delete image
porfolioRouter.delete("/portfolio/image/:id", async (req, res) => {
  try {
    if (!(req.user.roles === "superadmin" || req.user.roles === "Site Admin")) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    await req.query(`delete from image_links where id=${req.params.id}`);

    res.json({ message: "image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured" });
  }
});

module.exports = porfolioRouter;
