// const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());

// Array of finance accounts
let financeAccounts = [
  { name: 'MámaSpoř', value: 200_051, interest: 0.0001369836},
  { name: 'JáSpoř', value: 30251, interest: 0.0001369836 },

];

// Function to add interest to accounts at the end of each month
function addInterest() {
  let totalEarned = 0;

  financeAccounts.forEach(account => {
    const earned = account.value * account.interest;
    totalEarned += earned;
    account.value += earned;
  });

  const splitAmount = totalEarned / financeAccounts.length;
  financeAccounts.forEach(account => {
    account.value += splitAmount;
  });

}

// const job = schedule.scheduleJob('59 23 * * *', addDailyInterest);

// Schedule the task to run on  every day
const job = schedule.scheduleJob('59 23 * * *',  addInterest);
// const job2 = schedule.scheduleJob('* * * * * *', addInterest);
// API endpoint to retrieve account data
app.get('/accounts', (req, res) => {
  res.json(financeAccounts);
});



// API endpoint to set account data
app.post('/insert', (req, res) => {
  const { name, value } = req.body;
  const accountToUpdate = financeAccounts.find(account => account.name === name);

  if (accountToUpdate) {
    accountToUpdate.value += Number(value);
    res.json({ message: 'Account data updated successfully', financeAccounts });
  } else {
    res.status(404).json({ message: 'Account not found' });
  }
});
// Schedule the addInterest function to run at the end of each month


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// const transporter = nodemailer.createTransport({
//   // service: 'SendGrid',
//   host: "smtp.sendgrid.net",
//   port: 587,
//   secure: false, // `true` for port 465, `false` for all other ports
//   auth: {
//     user: 'ondralukes06@seznam.cz',
//     pass: ' ',
//   },
// });

// // Compose the email message
// const mailOptions = {
//   from: 'ondralukes06@seznam.cz',
//   to: 'ondralukes06@seznam.cz',
//   subject: 'Interest added to finance accounts',
//   text: `Finance accounts have been updated with interest. Updated values:\n\n${JSON.stringify(financeAccounts, null, 2)}`,
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log('Error sending email:', error);
//   } else {
//     console.log('Email sent:', info.response);
//   }
// });