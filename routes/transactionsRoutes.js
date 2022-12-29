const express = require('express');
const {
  getTransactions,
  transaction,
} = require('../controllers/transactionController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//require authorization for all account routes
router.use(requireAuth);

//get all transactions
router.get('/', getTransactions);

//post transaction
router.post('/', transaction);

module.exports = router;
