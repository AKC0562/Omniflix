import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function test() {
  await mongoose.connect(process.env.MONGO_URI || '');
  console.log('Connected');
  
  const tempUser = new User({
    email: 'test' + Date.now() + '@test.com',
    username: 'testuser' + Date.now(),
    password: 'password123',
    profiles: []
  });
  await tempUser.save();
  console.log('Created temp user');

  const user = await User.findById(tempUser._id);
  console.log('Loaded user');
  
  if (user) {
    user.profiles.push({
      name: 'Test Profile',
      avatar: 'heatblast',
      watchlist: [],
      preferences: { genres: [], language: 'en' }
    });
    
    try {
      await user.save();
      console.log('Saved successfully');
    } catch (err) {
      console.error('Save failed:', err);
    }
  }
  process.exit();
}

test();
