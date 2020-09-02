import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { EndPoint } from '../src/models/EndPoint';


describe('EndPoint Api', () => {

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should upsert end point', async () => {
    let r = await request(app).post('/endpoint/upsert')
      .send([{ url: 'u1', watchFields: { path: 'p1', value: 'v1' } }]);
    expect(await EndPoint.countDocuments({})).toEqual(1);
    expect(await EndPoint.findOne()).toHaveProperty('url', 'u1');
  });
});
