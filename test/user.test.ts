import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { EndPoint } from '../src/models/EndPoint';
import { User, UserDocument } from '../src/models/User';


describe('EndPoint Api', () => {

  let user: UserDocument;

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
    let endPoint = new EndPoint();
    endPoint.url = 'u2';
    await endPoint.save();

    user = new User();
    user.appleId = 'ijijwef';
    await user.save();
  });

  const post = (url: string) => {
    return request(app).post(url).set('apple-user-id', user.appleId);
  };
});
