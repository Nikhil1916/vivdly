const express = require("express");
const { User, validate } = require("../model/users");

class Users {
  constructor() {
    this.router = express.Router();
    this.postRoutes();
  }

  postRoutes() {
    this.router.post("/", async (req, res) => {
      try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const { name, password, emailId } = req.body;
        const userCheck = await User.findOne({emailId});
        if(userCheck) {
          return res.status(400).send("User already there..")
        }
        const user = new User({
          name,
          password,
          emailId,
        });

        await user.save();
        res.send(user);
      } catch (e) {
        return res.status(400).send("Error " + e?.message);
      }
    });
  }
}
module.exports = new Users().router;
