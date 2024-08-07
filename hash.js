const bcrypt = require('bcrypt');
const express = require('express');
// const mongoose = require('mongoose')
// const cors = require('cors')
// const JournalDB = require('./database');

const saltRounds = 10;
const password = '123';

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password,salt);
        console.log(hash);
    } catch (err) {
        console.error(err);
    }
}
hashPassword(password);


// bcrypt.compare("123", passwordHash, function(err, result) {
//     console.log(result);
// });

const app=express();
const port = 5000;

// app.use(cors());
app.use(express.json());

// //All required schemas below
// const contactSchema = new mongoose.Schema({
//     Name: {
//         type: String,
//         required: true,
//     },
//     Email: {
//         type: String,
//         required: true,
//     },
//     Message: {
//         type: String,
//         required: true,
//     }
// })

// const contactModel = mongoose.model('contacts',contactSchema);

// JournalDB();

// //All the routes below
// app.post('/contacts',async(req,res) => {
//     try {
//         const response = await contactModel.create(req.body);
//         console.log("Data Sent");
//         res.send(response);
//     } catch(error) {
//         res.status(500).send({message: "Oops Error!!!"})
//     }
// })

// app.post('/login',async (req,res)=>{

//     console.log("reached");
//     const {email, password} = req.body

//     const useremail = "bootcamp@test.com"
//     const userhash = "123"

//     let bcryptresponse = false

//     bcrypt.compare(password,userhash,(err,result)=>{
//         bcryptresponse = result
//     })


//     if(email === useremail && bcryptresponse)
//     {
//         console.log("Here")
//         res.status(200).json({msg:"Authorized"})
//     }
//     else
//     {
//         console.log("Here to else")
//         res.status(401).json({msg:"Not authorized"})
//     }
// })
//Starting the server
app.listen(port,()=>{
    console.log(`Server has started at port ${port}.`);
});

// app.post('/login', async (req, res) => {
//     console.log("reached");
  
//     const { email, password } = req.body;
  
//     try {
//       const user = await usermodel.findOne({ email: email });
  
//       if (!user) {
//         console.log("User not found");
//         return res.status(401).json({ msg: "Not authorized" });
//       }
  
//       const hash = user.password;
//       const useremail = user.email;
  
//       bcrypt.compare(password, hash, (err, result) => {
//         if (err) {
//           console.log("Error comparing passwords", err);
//           return res.status(500).json({ msg: "Internal server error" });
//         }
  
//         if (email === useremail && result) {
//           console.log("Authorized");
//           res.status(200).json({ msg: "Authorized" });
//         } else {
//           console.log("Not authorized");
//           res.status(401).json({ msg: "Not authorized" });
//         }
//       });
//     } catch (error) {
//       console.log("Error finding user", error);
//       res.status(500).json({ msg: "Internal server error" });
//     }
//   });


// require('dotenv').config();

// const bcrypt = require('bcrypt');
// const express = require('express');
// const mongoose = require('mongoose')
// const cors = require('cors')
// const JournalDB = require('./database');
// const jwt = require('jsonwebtoken');


// const JWT_SECRET = process.env.JWT_SECRET;


// const app=express();
// const port = 3000;
// const { Schema } = mongoose;

// app.use(cors());
// app.use(express.json());

// //All required schemas below
// const contactSchema = new mongoose.Schema({
//     Name: {
//         type: String,
//         required: true,
//     },
//     Email: {
//         type: String,
//         required: true,
//     },
//     Message: {
//         type: String,
//         required: true,
//     }
// })

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: [true, 'Email is required'], unique: true },
//   password: { type: String, required: [true, 'Password is required'] }
// })

// const journalSchema = new Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Journal = mongoose.model('Journal', journalSchema);
// const contactModel = mongoose.model('contacts',contactSchema);
// const usermodel = mongoose.model('users',userSchema);

// JournalDB();

// //All the routes below
// app.post('/contacts',async(req,res) => {
//     try {
//         const response = await contactModel.create(req.body);
//         console.log("Data Sent");
//         res.send(response);
//     } catch(error) {
//         res.status(500).send({message: "Oops Error!!!"})
//     }
// })


// app.post('/login', async (req, res) => {
//   console.log("Login request received");

//   const { email, password } = req.body;

//   try {
//     const user = await usermodel.findOne({ email: email });

//     if (!user) {
//       console.log("User not found for email:", email);
//       return res.status(401).json({ msg: "Not authorized" });
//     }

//     const hash = user.password;
//     const useremail = user.email;

//     const isMatch = bcrypt.compareSync(password, hash);

//     if (isMatch) {
//       console.log("Password match for email:", email);
//       res.status(200).json({ msg: "Authorized" });
//     } else {
//       console.log("Password mismatch for email:", email);
//       res.status(401).json({ msg: "Not authorized" });
//     }
//   } catch (error) {
//     console.error("Error finding user", error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });


//   app.post('/signup', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ msg: 'Email and password are required' });
//     }

//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user instance
//         const newUser = new usermodel({ email, password: hashedPassword });

//         // Save the new user to the database
//         await newUser.save();

//         res.status(201).json({ msg: 'User created successfully' });
//     } catch (error) {
//         console.error('Error creating user:', error);

//         // Check for validation errors
//         if (error.name === 'ValidationError') {
//             const errors = Object.values(error.errors).map(err => err.message);
//             return res.status(400).json({ msg: 'Validation error', errors });
//         }

//         // Check for duplicate email error
//         if (error.code && error.code === 11000) {
//             return res.status(400).json({ msg: 'Email already exists' });
//         }

//         // Handle other errors
//         res.status(500).json({ msg: 'Internal server error', error });
//     }
// });


// // const authenticate = (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader) {
// //     return res.status(401).json({ msg: 'Authorization header missing' });
// //   }

// //   const token = authHeader.split(' ')[1]; // Expecting 'Bearer TOKEN'

// //   if (!token) {
// //     return res.status(401).json({ msg: 'Token missing' });
// //   }

// //   jwt.verify(token, JWT_SECRET, (err, decoded) => {
// //     if (err) {
// //       return res.status(401).json({ msg: 'Invalid token' });
// //     }
// //     req.userId = decoded.userId;
// //     next();
// //   });
// // };

// const authenticate = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (token == null) return res.sendStatus(401); // No token provided

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403); // Invalid token
//     req.user = user;
//     next();
//   });
// };


// // app.post('/journals', authenticate, async (req, res) => {
// //   const { title, content, date } = req.body;
// //   console.log("Reached to journal creation...");

// //   if (!title || !content) {
// //     console.error('Title or content missing');
// //     return res.status(400).json({ msg: 'Title and content are required' });
// //   }

// //   try {
// //     const newJournal = new Journal({
// //       title,
// //       content,
// //       date: date || new Date(),
// //       user: req.userId,
// //     });
// //     await newJournal.save();
// //     res.status(201).json({ msg: 'Journal created', journal: newJournal });
// //   } catch (error) {
// //     console.error('Error creating journal entry:', error);
// //     res.status(500).json({ msg: 'Internal server error' });
// //   }
// // });

// app.post('/journals', authenticate, (req, res) => {
//   const { title, content, date } = req.body;

//   // Assuming you have a Journal model to save the data
//   Journal.create({ title, content, date, userId: req.user.id })
//     .then(journal => res.json(journal))
//     .catch(err => res.status(500).json({ error: 'Failed to create journal entry' }));
// });

// // Get User's Journals Route
// app.get('/journals', authenticate, async (req, res) => {
//   try {
//     const journals = await Journal.find({ user: req.userId });
//     res.status(200).json(journals);
//   } catch (error) {
//     console.error('Error fetching journals:', error);
//     res.status(500).json({ msg: 'Internal server error' });
//   }
// });

// // Update Journal Route
// app.put('/journals/:id', authenticate, async (req, res) => {
//   const { title, content } = req.body;
//   const { id } = req.params;

//   try {
//     const journal = await Journal.findOneAndUpdate(
//       { _id: id, user: req.userId },
//       { title, content },
//       { new: true }
//     );

//     if (!journal) return res.status(404).json({ msg: 'Journal not found' });

//     res.status(200).json(journal);
//   } catch (error) {
//     res.status(500).json({ msg: 'Internal server error' });
//   }
// });

// // Delete Journal Route
// app.delete('/journals/:id', authenticate, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const journal = await Journal.findOneAndDelete({ _id: id, user: req.userId });

//     if (!journal) return res.status(404).json({ msg: 'Journal not found' });

//     res.status(200).json({ msg: 'Journal deleted' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Internal server error' });
//   }
// });

// //Starting the server
// app.listen(port,()=>{
//     console.log(`Server has started at port ${port}.`);
// });


// app.post('/login', async (req, res) => {
//   console.log("Login request received");

//   const { email, password } = req.body;

//   try {
//     const user = await usermodel.findOne({ email: email });

//     if (!user) {
//       console.log("User not found for email:", email);
//       return res.status(401).json({ msg: "Not authorized" });
//     }

//     const hash = user.password;
//     const useremail = user.email;

//     const isMatch = bcrypt.compareSync(password, hash);

//     if (isMatch) {
//       console.log("Password match for email:", email);
//       const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//       res.status(200).json({ msg: "Authorized", token });
//     } else {
//       console.log("Password mismatch for email:", email);
//       res.status(401).json({ msg: "Not authorized" });
//     }
//   } catch (error) {
//     console.error("Error finding user", error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });
