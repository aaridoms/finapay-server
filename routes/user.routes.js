const router = require("express").Router();

const User = require("../models/User.model");
const Expense = require("../models/Expense.model");
const Investment = require("../models/Investment.model");
const Transaction = require("../models/Transaction.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

// GET 'api/account/summary' => to get the summary of the user
router.get("/summary", isAuthenticated ,async (req, res, next) => {

  // console.log(req.payload)
  const { _id } = req.payload;

  try {
    const foundUser = await User.findById(_id).populate("expenses")
    const foundTransaction = await Transaction.find({ $or: [{ from: _id }, { to: _id }] }).populate("from").populate("to")
    const allUsers = await User.find({_id: { $ne: _id }})

    // console.log(foundTransaction)


    res.json({foundUser, foundTransaction, allUsers});
  } catch (error) {
    next(error);
  }
});

// POST 'api/account/add-funds' => to add funds to the user
router.post("/add-funds", isAuthenticated, async (req, res, next) => {

  const { funds } = req.body;
  const { _id } = req.payload;

  try {
    await User.findByIdAndUpdate(_id, { $inc: { funds: funds } }, { new: true });
    res.json("Funds successfully added");
  } catch (error) {
    next(error);
  }
});

// GET '/api/account/profile' => to get the profile of the user
router.get("/profile", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;
  console.log(req.payload)
  try {
    const foundUser = await User.findById(_id);
    console.log(foundUser)
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
});

// PATCH '/api/account/profile/edit-email' => to edit the profile of the user
router.patch("/profile/edit-email", isAuthenticated, async (req, res, next) => {

  const { email } = req.body;
  const { _id } = req.payload;
  const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  if(regexEmail.test(email) === false) {
    res.status(400).json({ errorMessage: "Please, enter a valid email" });
    return;
  }

  try {
    const response = await User.findByIdAndUpdate(_id, {email}, { new: true });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST '/api/account/investment/join' => user can join an investment
router.post("/investment/join", isAuthenticated, async (req, res, next) => {


  try {
    // const investmentType = await Investment.find
  } catch (error) {
    next(error);
  }
});

module.exports = router;