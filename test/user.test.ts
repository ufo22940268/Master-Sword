import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { EndPoint } from '../src/models/EndPoint';
import { User, UserDocument } from '../src/models/User';
import RequestAgent from './RequestAgent';


describe('User Api', () => {

  let user: UserDocument;
  let agent: RequestAgent;

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    let endPoint = new EndPoint();
    endPoint.url = 'u2';
    await endPoint.save();

    user = new User();
    user.appleId = 'id1';
    await user.save();
    agent = new RequestAgent(user);
  });

  it('should return error when not passed required variable ', async () => {
    let r = await request(app).post('/user/login')
      .send({});
    expect(r.body).toHaveProperty('ok', false);
  });

  it('login', async () => {
    let r = await request(app).post('/user/login')
      .send({ appleUserId: 'id1' });
    expect(r.body.result).toHaveProperty('_id', user._id.toString());

    r = await request(app).post('/user/login')
      .send({ appleUserId: 'id2', username: 'kk' });
    expect(r.body.result).toHaveProperty('appleId', 'id2');
  });
});
