const Joi = require("joi");
const express = require("express");
const router = express.Router();
const {Customer, validateCustomer} = require("../model/customers");

router.get("/", async(req, res) => {
  try {
    const customers = await Customer.find().sort("-_id");
    return res.send(customers);
  } catch (e) {
    return res.status(400).send(e?.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({ name: req.body.name, phone: req.body.phone, isGold: req.body.isGold, emailId: req.body.emailId });
    customer = await customer.save();

    res.send(customer);
  } catch (e) {
    res.send("Error " + e?.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
      emailId: req.body.emailId
    },
    {
      new: true,
    }
  );

  if (!customer)
    return res.status(404).send("The customer with the given ID was not found.");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res.status(404).send("The customer with the given ID was not found.");

  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("The customer with the given ID was not found.");

  res.send(customer);
});


module.exports = router;
