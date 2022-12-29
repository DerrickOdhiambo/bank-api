const Account = require('../models/accountModel');
const mongoose = require('mongoose');

//create new account
const createAccount = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user_id = req.user._id;
    const accountNumber = Math.floor(100000000 + Math.random() * 900000000);

    const account = await Account.create({
      user_id,
      name,
      email,
      accountNumber,
    });
    res.status(200).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get all accounts
const getAllAccounts = async (req, res) => {
  const accounts = await Account.find({}).sort({ createdAt: -1 });
  res.status(200).json(accounts);
};

//get single accounts
const getAccount = async (req, res) => {
  const { id } = req.params;

  //checks is provide id is a valid mongoose id to avoid server crash.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'This Account does not exist' });
  }

  const account = await Account.find({ user_id: id });

  if (!account) {
    return res.status(404).json({ error: 'Account does not exist' });
  }

  const acc = account.pop();

  res.status(200).json(acc);
};

module.exports = { createAccount, getAllAccounts, getAccount };
