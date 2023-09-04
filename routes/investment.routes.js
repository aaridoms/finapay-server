const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

const Investment = require("../models/Investment.model");
const User = require("../models/User.model");

// GET '/api/account/investments' => Get all investments
router.get("/investments", isAuthenticated, async (req, res, next) => {
  try {
    const allInvestment = await Investment.find();
    res.status(200).json(allInvestment);
  } catch (error) {
    next(error);
  }
});

// POTS '/api/account/investments/add' => Add a new investment
router.post("/investments/add", isAuthenticated, async (req, res, next) => {
  const { name, risk, interesRate, category, duration, notes } = req.body;

  try {
    await Investment.create({
      name,
      risk,
      interesRate,
      category,
      duration,
      notes,
    });

    res.status(201).json("Investment created successfully");
  } catch (error) {
    next(error);
  }
});

// DELETE '/api/account/investments/:investmentId/delete' => Delete an investment
router.delete(
  "/investments/:investmentId/delete",
  isAuthenticated,
  async (req, res, next) => {
    const { investmentId } = req.params;

    try {
      await Investment.findByIdAndDelete(investmentId);
      res.status(200).json("Investment deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

// POST '/api/account/investments/:investmentId/join => user can join an investment
router.post(
  "/investments/:investmentId/join",
  isAuthenticated,
  async (req, res, next) => {
    const { investmentId } = req.params;
    const { _id } = req.payload;
    const { amount } = req.body;

    try {
      const oneInvestment = await Investment.findById(investmentId);
      await User.findByIdAndUpdate(
        _id,
        { $inc: { funds: -amount } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        _id,
        { $push: { investments: investmentId } },
        { new: true }
      );

      let infoToUser = "";
      let youWon = null;

      const interval = setInterval(async () => {
        const randomNumber = Math.floor(Math.random() * 100);
        try {
          if (oneInvestment.risk === "Low") {
            if (randomNumber <= 3) {
              const newFunds = amount * (1 - oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              infoToUser += `Your investment has been a success: You have won ${newFunds}`;
              youWon = true;
            } else {
              const newFunds = amount * (1 + oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              infoToUser = `Your investment has been a failure: You have lost ${newFunds}`;
              youWon = false;
            }
          } else if (oneInvestment.risk === "Medium") {
            if (randomNumber <= 10) {
              const newFunds = amount * (1 - oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              infoToUser += `Your investment has been a success: You have won ${newFunds}`;
              youWon = true;
            } else {
              const newFunds = amount * (1 + oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              infoToUser += `Your investment has been a failure: You have lost ${newFunds}`;
              youWon = false;
            }
          } else if (oneInvestment.risk === "High") {
            if (randomNumber <= 25) {
              const newFunds = amount * (1 - oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              infoToUser += `Your investment has been a success: You have won ${newFunds}`;
              youWon = true;
            } else {
              const newFunds = amount * (1 + oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              infoToUser += `Your investment has been a failure: You have lost ${newFunds}`;
              youWon = false;
            }
          }
          clearInterval(interval);
        } catch (error) {
          console.log(error);
        }
      }, 1000 * oneInvestment.duration);

      res
        .status(201)
        .json( "joined" );
    } catch (error) {
      next(error);
    }
  }
);

// GET '/api/account/investments/user-investment' => Get all investments of the user
router.get(
  "/investments/user-investment",
  isAuthenticated,
  async (req, res, next) => {
    const { _id } = req.payload;

    try {
      const userInvestments = await User.findById(_id).populate("investments");
      res.status(200).json(userInvestments.investments);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
