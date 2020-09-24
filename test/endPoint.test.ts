import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import {EndPoint, EndPointDocument} from '../src/models/EndPoint';
import {User, UserDocument} from '../src/models/User';
import RequestAgent from './RequestAgent';
import {ScanLog} from "../src/models/ScanLog";
import fetchMock from 'jest-fetch-mock'
import '../src/util/initMongo'
import {deleteCollectionsBeforeTest} from "./dbHelper";

describe('EndPoint Api', () => {

    let user: UserDocument;
    let agent: RequestAgent;
    let endPoint: EndPointDocument;

    beforeEach(async () => {
        await deleteCollectionsBeforeTest()

        user = new User();
        user.appleId = 'ijijwef';
        await user.save();

        endPoint = new EndPoint();
        endPoint.url = 'u2';
        endPoint.user = user;
        await endPoint.save();

        agent = new RequestAgent(user);
        fetchMock.mockIf(/.*/, '{"a": 3, "ar": [{"j": 10}], "b": {"c": 10}}')
    });

    const post = (url: string) => {
        return agent.post(url).set('apple-user-id', user.appleId);
    };

    it('should return an error when user not login', async () => {
        let r = await request(app).post('/endpoint/upsert')
            .send({url: 'u1', watchFields: [{path: 'p1', value: 'v1'}]});
        expect(r.body).toHaveProperty('ok', false);
    });

    it('should upsert end point', async () => {
        let r = await post('/endpoint/upsert')
            .send({url: 'u1', watchFields: [{path: 'p1', value: 'v1'}]});
        expect(await EndPoint.countDocuments({url: 'u1'})).toEqual(1);
        let ep = await EndPoint.findOne({url: 'u1'});
        expect(ep).toHaveProperty('url', 'u1');
        expect(ep.watchFields[0])
            .toEqual(expect.objectContaining({path: 'p1', value: 'v1'}));

        await post('/endpoint/upsert')
            .send({url: 'u1', watchFields: [{path: 'p2', value: 'v1'}]});
        expect(await EndPoint.countDocuments({url: 'u1'})).toEqual(1);
        expect(await EndPoint.findOne({url: 'u1'})).toHaveProperty('url', 'u1');
        ep = await EndPoint.findOne({url: 'u1'});
        expect(ep.watchFields[0])
            .toEqual(expect.objectContaining({path: 'p2', value: 'v1'}));
    });

    it('should sync', async () => {
        await post('/endpoint/sync')
            .send([{url: 'u1', watchFields: [{path: 'p1', value: 'v1'}]}]);
        let ep = await EndPoint.findOne({url: 'u1'});
        expect(ep).toHaveProperty('url', 'u1');
        expect(ep.watchFields[0])
            .toEqual(expect.objectContaining({path: 'p1', value: 'v1'}));
    })

    it('should list endpoints to sync from', async () => {
        let {body: {result}} = await agent.get('/endpoint/sync/list')
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('url');
    })

    it('should scan endpoints', async () => {
        await post('/endpoint/scan')
        expect(await ScanLog.countDocuments({endPoint: endPoint})).toBeGreaterThan(0);
    })

    it('should delete endpoint', async () => {
        await post('/endpoint/delete')
            .send({url: 'u2'});
        expect(await EndPoint.findOne({url: 'u2'})).toBeFalsy();
    });
});
