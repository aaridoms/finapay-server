const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

const Investment = require('../models/Investment.model');
const User = require('../models/User.model');

// GET '/api/account/investments' => Get all investments
router.get('/investments', isAuthenticated, async (req, res, next) => {


  try {
    const allInvestment = await Investment.find()
    res.status(200).json(allInvestment);
  } catch (error) {
    next(error);
  }
});

// POTS '/api/account/investments/add' => Add a new investment
router.post('/investments/add', isAuthenticated, async (req, res, next) => {
  
  const { name, amount, risk, interesRate, category, duration, notes } = req.body;
  
  try {
    await Investment.create({ name, amount, risk, interesRate, category, duration, notes });

    res.status(201).json('Investment created successfully');
  } catch (error) {
    next(error);
  }
});

// DELETE '/api/account/investments/:investmentId/delete' => Delete an investment
router.delete('/investments/:investmentId/delete', isAuthenticated, async (req, res, next) => {

  const { investmentId } = req.params;

  try {
    await Investment.findByIdAndDelete(investmentId);
    res.status(200).json('Investment deleted successfully');
  } catch (error) {
    next(error);
  }
});

// POST '/api/account/investments/:investmentId/join => user can join an investment
router.post('/investments/:investmentId/join', isAuthenticated, async (req, res, next) => {

  const { investmentId } = req.params;
  const { _id } = req.payload;

  try {
    await User.findByIdAndUpdate(_id, { $push: { investments: investmentId } }, { new: true });
    res.status(201).json('Investment joined successfully');
  } catch (error) {
    next(error);
  }
});

// GET '/api/account/investments/user-investment' => Get all investments of the user
router.get('/investments/user-investment', isAuthenticated, async (req, res, next) => {

  const { _id } = req.payload;

  try {
    const userInvestments = await User.findById(_id).populate('investments');
    res.status(200).json(userInvestments.investments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;