import mongoose from 'mongoose';

export default async (mongoUri, obj = {}) => {
  return mongoose
    .connect(mongoUri, { useNewUrlParser: true, ...obj })
    .then(console.log('Successfully made connection with mongoDB'))
    .catch(e => console.log(e));
};
