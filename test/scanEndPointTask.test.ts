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

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        endPoint = new EndPoint();
        endPoint.url = 'https://success.com/';
        endPoint.watchFields = [{
            path: 'a',
            value: '3'
        }]
        await endPoint.save();

        user = new User();
        user.appleId = 'id1';
        await user.save();
        agent = new RequestAgent(user);

        fetchMock.mockIf(/success/, '{"a": 3, "ar": [{"j": 10}], "b": {"c": 10}}')
    });

    it('should scan server', async () => {
        await scanEndPoints();
        let log = await ScanLog.findOne({endPoint: endPoint});
        expect(log).not.toBeFalsy();
        expect(log.endPoint._id.toString()).toEqual(endPoint.id)
        expect(log.batch).not.toBeFalsy();
        expect(log.duration).toBeGreaterThan(0);
        expect(log.fields[0].match).toBeTruthy();
        expect(log.data).toBeTruthy();
    });

    describe('when server return unexpected values', () => {

        beforeEach(async () => {
            endPoint.watchFields[0].value = '9'
            endPoint.watchFields.push({path: 'ar.j', value: '10'})
            endPoint.watchFields.push({path: 'b.c', value: '10'})
            await endPoint.save();
        });

        it('should scan server', async () => {
            await scanEndPoints();
            let log = await ScanLog.findOne({endPoint: endPoint});
            expect(log.fields[0].match).toBeFalsy();
            expect(log.fields[1].match).toBeTruthy();
            expect(log.fields[2].match).toBeTruthy();
        });
    })
});
