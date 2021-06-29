const express = require("express");

const customerRouter = new express.Router();

customerRouter.get("/customer/getAll", async (req, res) => {
  try {
    if (req.user.roles === "superadmin") {
      const data = await req.query(
        `SELECT * FROM customers ORDER BY timestamp DESC`
      );
      return res.json({ customer: data });
    }

    const data = await req.query(
      `SELECT * FROM customers WHERE added_by=? ORDER BY timestamp DESC`,
      [req.user.name]
    );
    return res.json({ customer: data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Some error occured", error: error.message });
  }
});

customerRouter.get("/customer/:id", async (req, res) => {
  try {
    const data = await req.query(
      `SELECT * FROM customers WHERE id=${req.params.id}`
    );

    res.json({ user: data[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

customerRouter.get("/customer/testimonial/getAll", async (req, res) => {
  try {
    const testimonials = await req.query(`SELECT * FROM testimonials`);

    res.json({ testimonials });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

customerRouter.post("/customer/testimonial", async (req, res) => {
  try {
    const testimonial = await req.query(`INSERT INTO testimonials SET ?`, {
      ...req.body,
    });

    res.json({ message: "Thank you for the feedback" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to post testimonial" });
  }
});

customerRouter.post("/customer/enquire", async (req, res) => {
  try {
    await req.query(`INSERT INTO customers SET ?`, {
      ...req.body,
      timestamp: new Date(),
    });

    res.json({ message: "We will reach out to you soon!" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res
        .status(409)
        .json({ message: "Your previous enquiry is in process" });
    res.status(500).json({ message: "Unable to add enquiry" });
  }
});

// to update a customers details
customerRouter.put("/customer/update/:id", async (req, res) => {
  try {
    await req.query(`UPDATE customers SET ? WHERE id='${req.params.id}'`, {
      ...req.body,
      timestamp: new Date(),
    });

    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ message: "Some error occured" });
  }
});

customerRouter.delete("/customer/testimonial/:id", async (req, res) => {
  try {
    await req.query(`DELETE FROM testimonials WHERE id=${req.params.id}`);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to post testimonial" });
  }
});

module.exports = customerRouter;
