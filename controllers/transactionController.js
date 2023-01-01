const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');
const mongoose = require('mongoose');
const { find } = require('../models/accountModel');

//get all transactions
const getTransactions = async (req, res) => {
  const user_id = req.user._id;
  const transactions = await Transaction.find({ user_id }).sort({
    createdAt: -1,
  });
  res.status(200).json(transactions);
};

//post deposit/widthdraw money to the database
const transaction = async (req, res) => {
  const { transactionType, amount } = req.body;

  //posts transaction to the database

  try {
    const user_id = req.user._id;
    const transaction = await Transaction.create({
      user_id,
      transactionType,
      amount,
    });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//updates balance
const updateBalance = async (req, res) => {
  const { id } = req.params;
  const { transactionType, amount } = req.body;

  //checks is provide id is a valid mongoose id to avoid server crash.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Account does not exist' });
  }

  //get account balance
  const account = await Account.findById(id);
  const balance = account.balance;

  //check transaction type and update balance
  let updatedBalance;

  if (transactionType === 'deposit') {
    updatedBalance = balance + parseInt(amount);
  }

  if (transactionType === 'withdrawal') {
    if (parseInt(amount) > balance) {
      return res.status(400).json({
        error: `You cannot withdraw the required amount because your account balance is ${balance}`,
      });
    }
    updatedBalance = balance - parseInt(amount);
  }

  const updatedAccount = await Account.findByIdAndUpdate(
    { _id: id },
    { $set: { balance: updatedBalance } },
    { new: true }
  );

  //checks if account exists
  if (!updatedAccount) {
    return res.status(404).json({ error: 'That Account does not exist' });
  }

  res.status(200).json(updatedAccount);
};

// transfer cash
const transferFunds = async (req, res) => {
  const { id } = req.params;
  const { accountNumber, amount } = req.body;

  //checks is provide id is a valid mongoose id to avoid server crash.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Account does not exist' });
  }

  const userAccount = await Account.findById(id);
  if (!userAccount) {
    return res.status(400).json({ error: 'Account not found' });
  }

  let userBalance;
  const initialBalance = userAccount.balance;

  if (parseInt(amount) > initialBalance) {
    return res.status(400).json({
      error: 'Not enough funds available to make tranfer',
    });
  } else {
    userBalance = initialBalance - parseInt(amount);
  }

  const updatedUserAccount = await Account.findByIdAndUpdate(
    { _id: id },
    { $set: { balance: userBalance } },
    { new: true }
  );

  const accNumber = parseInt(accountNumber);

  const account = await Account.find({ accountNumber: accNumber });

  const recipientAccount = account.pop();

  if (!recipientAccount) {
    return res.status(400).json({
      error: 'Account does not exist. Please enter a valid account number',
    });
  }

  let updatedBalance;
  const balance = recipientAccount.balance;
  const recipientId = recipientAccount._id;

  if (account) {
    updatedBalance = balance + parseInt(amount);
  }

  const tranferredAccount = await Account.findByIdAndUpdate(
    { _id: recipientId },
    { $set: { balance: updatedBalance } },
    { new: true }
  );

  res.status(200).json({
    updatedUserAccount,
    message: `Succefully transferred ${amount}$ to ${tranferredAccount.name}`,
  });
};

module.exports = {
  getTransactions,
  transaction,
  updateBalance,
  transferFunds,
};
