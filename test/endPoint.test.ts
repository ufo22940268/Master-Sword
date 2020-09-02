import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { EndPoint } from '../src/models/EndPoint';
import objectContaining = jasmine.objectContaining;


describe('EndPoint Api', () => {

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should upsert end point', async () => {
    await request(app).post('/endpoint/upsert')
      .send({ url: 'u1', watchFields: [{ path: 'p1', value: 'v1' }] });
    expect(await EndPoint.countDocuments({})).toEqual(1);
    let ep = await EndPoint.findOne();
    expect(ep).toHaveProperty('url', 'u1');
    expect(ep.watchFields[0])
      .toEqual(expect.objectContaining({ path: 'p1', value: 'v1' }));

    await request(app).post('/endpoint/upsert')
      .send({ url: 'u1', watchFields: [{ path: 'p2', value: 'v1' }] });
    expect(await EndPoint.countDocuments({})).toEqual(1);
    expect(await EndPoint.findOne()).toHaveProperty('url', 'u1');
    ep = await EndPoint.findOne();
    expect(ep.watchFields[0])
      .toEqual(expect.objectContaining({ path: 'p2', value: 'v1' }));
  });
});
