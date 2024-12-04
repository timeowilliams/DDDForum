/*
Build out 3 user management API endpoints from DDDForum on the backend
 as minimally and quickly as possible using Express.js,
TypeScript and whatever database and/or ORM you’d like. 
That’ll be createUser, editUser and getUserByEmail.
*/
import express from 'express';
import { connectToDb } from './connectToDb';
import { User } from './models/user';


const app = express();
connectToDb();

app.get('/', (req, res) => {
  res.send('Hello World!');
}); 

const router = express.Router();

// Create User  
router.post('/users/new', async (req, res) => {
  try {
    const { email, username, firstName, lastName } = req.body;
    
     // Validate required fields
     if (!email || !username || !firstName || !lastName) {
      return res.status(400).json(
        { error: 'ValidationError',
           data: undefined,
            success: false 
          });
    }
    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByUsername) {
      return res.status(409).json({ 
        error: 'UsernameAlreadyTaken', 
        data: undefined, 
        success: false 
      });
    }

    if (existingUserByEmail) {
      return res.status(409).json({ 
        error: 'EmailAlreadyInUse', 
        data: undefined, 
        success: false 
      });
    }

    const newUser = new User({
      email,
      username,
      firstName,
      lastName
    });

    await newUser.save();

    res.status(201).json({ 
      error: undefined, 
      data: {
        email,
        username,
        firstName,
        lastName
      },
      success: true
    });
  } catch (error) {
    res.status(500).json(
      { error: 'ServerError',
        data: undefined,
        success: false });
  }
});

// Edit User
router.put('/editUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, username, email} = req.body;

        // Validate required fields
        if (!email || !username || !firstName || !lastName) {
          return res.status(400).json(
            { error: 'ValidationError',
               data: undefined,
                success: false 
              });
        }

    if(userId) {
        // Check if userid exists
      const existingUserId = await User.findOne({ 
        _id: { $ne: userId } 
      });
      if(!existingUserId) {
      return res.status(404).json(
        { error: 'UserNotFound',
          data: undefined,
          success: false }
        );
    }
  }

    // Check if username is already taken
    if (username) {
      const existingUsername = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      
      if (existingUsername) {
        return res.status(409).json({ 
          error: 'UsernameAlreadyTaken',
          data: undefined,
          success: false });
      }
    }

      // Check if email is already taken
      if (email) {
        const existingEmail = await User.findOne({ 
          email, 
          _id: { $ne: userId } 
        });
        
        if (existingEmail) {
          return res.status(409).json({ 
            error: 'EmailAlreadyInUseAlreadyTaken',
            data: undefined,
            success: false });
        }
      }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { firstName, lastName, username },
      { new: true, runValidators: true }
    );

    await updatedUser.save();

    res.status(201).json({ 
      error: undefined, 
      data: {
        email,
        username,
        firstName,
        lastName
      },
      success: true
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'ServerError',
      data: undefined, 
      success: false });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameters
    let users;

    if (email) {
      // Find user by email if provided
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: 'UserNotFound',
          data: undefined,
          success: false
        });
      }
      // Note, returning an array because users is plural
      users = [{
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }]
    } else {
      // If no email is provided, return all users
      users = await User.find({}, 'email username firstName lastName'); 
    }

    res.status(200).json({ 
      error: undefined, 
      data: users,
      success: true
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'ServerError',
      data: undefined, 
      success: false 
    });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
