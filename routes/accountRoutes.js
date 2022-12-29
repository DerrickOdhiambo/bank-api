const express = require('express');
const {
  createAccount,
  getAllAccounts,
  getAccount,
} = require('../controllers/accountController');
const {
  transaction,
  updateBalance,
  getTransactions,
} = require('../controllers/transactionController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//require authorization for all account routes
router.use(requireAuth);

//get all accounts
router.get('/', getAllAccounts);

//get a single account
router.get('/:id', getAccount);

//create account
router.post('/create-account', createAccount);

//update account
router.patch('/:id', updateBalance);

module.exports = router;
