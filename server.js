require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JournalDB = require('./database');


const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
const port = 3000;
const { Schema } = mongoose;

app.use(cors());
app.use(express.json());

// All required schemas below
const contactSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'] },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const journalSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: {
    type: Date,
    default: Date.now
  }
});

const Journal = mongoose.model('Journal', journalSchema);
const contactModel = mongoose.model('contacts', contactSchema);
const usermodel = mongoose.model('users', userSchema);

JournalDB();

// All the routes below

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();
    console.log('Token saved for user:', email);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_ADDRESS,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        https://mylifeline.onrender.com/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', email);

    res.json({ message: 'An e-mail has been sent with further instructions.' });
  } catch (error) {
    console.error('Error in /forgot-password route:', error);
    res.status(500).json({ message: 'Error on the server' });
  }
});

app.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await usermodel.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration date

    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error on the server', error: error.message });
  }
});

app.get('/reset/:token', async (req, res) => {
  try {
    const user = await usermodel.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() } // Token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // If the token is valid, you can render a reset password form or send a response
    res.status(200).json({ message: 'Token is valid. You can reset your password.' });
  } catch (error) {
    console.error('Error in /reset/:token route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/contacts', async (req, res) => {
  try {
    const response = await contactModel.create(req.body);
    console.log("Data Sent");
    res.send(response);
  } catch (error) {
    res.status(500).send({ message: "Oops Error!!!" });
  }
});


app.post('/login', async (req, res) => {
  console.log("Login request received");

  const { email, password } = req.body;

  try {
    const user = await usermodel.findOne({ email: email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ msg: "Not authorized" });
    }

    const hash = user.password;
    const isMatch = bcrypt.compareSync(password, hash);

    if (isMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      console.log("Password match for email:", email);
      res.status(200).json({ msg: "Authorized", token: token });
    } else {
      console.log("Password mismatch for email:", email);
      res.status(401).json({ msg: "Not authorized" });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

app.post('/signup', async (req, res) => {
  console.log("Reached")
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new usermodel({ email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);

    // Check for validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: 'Validation error', errors });
    }

    // Check for duplicate email error
    if (error.code && error.code === 11000) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Handle other errors
    res.status(500).json({ msg: 'Internal server error', error });
  }
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

app.post('/journals', authenticate, async (req, res) => {
  const { title, content, date } = req.body;

  if (!title || !content) {
    console.error('Title or content missing');
    return res.status(400).json({ msg: 'Title and content are required' });
  }

  try {
    const newJournal = new Journal({
      title,
      content,
      date: date || new Date(),
      user: req.user.userId,
    });
    await newJournal.save();
    res.status(201).json({ msg: 'Journal created', journal: newJournal });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

app.get('/journals', authenticate, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.userId });
    res.status(200).json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});



app.put('/journals/:id', authenticate, async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  try {
    const journal = await Journal.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { title, content },
      { new: true }
    );

    if (!journal) return res.status(404).json({ msg: 'Journal not found' });

    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
});

app.get('/journals/:id', authenticate, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) {
      return res.status(404).json({ msg: 'Journal not found' });
    }
    res.status(200).json(journal);
  } catch (error) {
    console.error('Error fetching journal:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});


app.delete('/journals/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const journal = await Journal.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!journal) return res.status(404).json({ msg: 'Journal not found' });

    res.status(200).json({ msg: 'Journal deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server has started at port ${port}.`);
});
