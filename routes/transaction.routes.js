const router = require("express").Router();

const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");

const isAuthenticated = require("../middlewares/isAuthenticated");

// POST 'api/account/send' => Crea una nueva transacción
router.post("/send", isAuthenticated, async (req, res, next) => {
  
  const { to, amount, concept } = req.body;
  const { _id } = req.payload;
  
  try {

    await User.findByIdAndUpdate(_id, { $inc: { funds: -amount } }, { new: true });
    await User.findByIdAndUpdate(to, { $inc: { funds: amount } }, { new: true });

    await Transaction.create({
      from: _id,
      to,
      amount,
      concept,
    });

    res.json("Transaction successfully created");
  } catch (error) {
    next(error);
  }
});

module.exports = router;