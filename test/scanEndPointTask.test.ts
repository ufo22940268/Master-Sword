import mongoose from 'mongoose';
import {EndPoint, EndPointDocument} from '../src/models/EndPoint';
import {User, UserDocument} from '../src/models/User';
import RequestAgent from './RequestAgent';
import {scanEndPoints} from '../src/tasks/scanEndPointTask';
import {ScanLog} from '../src/models/ScanLog';
import fetchMock from 'jest-fetch-mock'
import fetch from "node-fetch";

describe('Scan EndPoint', () => {

    let user: UserDocument;
    let agent: RequestAgent;
    let endPoint: EndPointDocument;

    beforeAll(async () => {
        await mongoose.connection.dropDatabase();
        endPoint = new EndPoint();
        endPoint.url = 'https://success.com/';
        await endPoint.save();

        user = new User();
        user.appleId = 'id1';
        await user.save();
        agent = new RequestAgent(user);

        fetchMock.mockIf(/success/, 'oij')
    });

    it('should scan server', async () => {
        await scanEndPoints();
        let log = await ScanLog.findOne({endPoint: endPoint});
        expect(log).not.toBeFalsy();
        expect(log.endPoint._id.toString()).toEqual(endPoint.id)
        expect(log.batch).not.toBeFalsy();
        // expect(log.duration).toBeGreaterThan(0);
    });
});
