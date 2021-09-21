import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined.');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    // auth-mongo-srv is the name of the mongo-db service deployment
    // auth is the name of the db we want to create (mongoose will automatically create it)
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
};

start();
