import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { EndPoint } from '../src/models/EndPoint';


describe('EndPoint Api', () => {

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
    let endPoint = new EndPoint();
    endPoint.url = 'u2';
    await endPoint.save();
  });

  it('should upsert end point', async () => {
    await request(app).post('/endpoint/upsert')
      .send({ url: 'u1', watchFields: [{ path: 'p1', value: 'v1' }] });
    expect(await EndPoint.countDocuments({ url: 'u1' })).toEqual(1);
    let ep = await EndPoint.findOne({ url: 'u1' });
    expect(ep).toHaveProperty('url', 'u1');
    expect(ep.watchFields[0])
      .toEqual(expect.objectContaining({ path: 'p1', value: 'v1' }));

    await request(app).post('/endpoint/upsert')
      .send({ url: 'u1', watchFields: [{ path: 'p2', value: 'v1' }] });
    expect(await EndPoint.countDocuments({ url: 'u1' })).toEqual(1);
    expect(await EndPoint.findOne({ url: 'u1' })).toHaveProperty('url', 'u1');
    ep = await EndPoint.findOne({ url: 'u1' });
    expect(ep.watchFields[0])
      .toEqual(expect.objectContaining({ path: 'p2', value: 'v1' }));
  });

  it('should delete endpoint', async () => {
    await request(app).post('/endpoint/delete')
      .send({ url: 'u2' });
    expect(await EndPoint.findOne({ url: 'u2' })).toBeFalsy();
  });
});
