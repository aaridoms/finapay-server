const router = require("express").Router();

const User = require("../models/User.model");
const Expense = require("../models/Expense.model");
const Investment = require("../models/Investment.model");
const Transaction = require("../models/Transaction.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

// GET 'api/account/summary' => to get the summary of the user
router.get("/summary", isAuthenticated ,async (req, res, next) => {

  // console.log(req.payload)
  const { id } = req.payload;

  try {
    const foundUser = await User.findById(id).populate("expenses")
    const foundTransaction = await Transaction.find({ $or: [{ from: id }, { to: id }] })

    // console.log(foundTransaction)


    res.json("Falta mirarlo bien");
  } catch (error) {
    next(error);
  }
});

// GET '/api/account/profile' => to get the profile of the user
router.get("/profile", isAuthenticated, async (req, res, next) => {
  const { id } = req.payload;

  try {
    const foundUser = await User.findById(id);

    res.json(foundUser);
  } catch (error) {
    next(error);
  }
});

// PATCH '/api/account/profile/edit-email' => to edit the profile of the user
router.patch("/profile/edit-email", isAuthenticated, async (req, res, next) => {

  const { email } = req.body;
  const { id } = req.payload;

  try {
    const response = await User.findByIdAndUpdate(id, {email}, { new: true });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;