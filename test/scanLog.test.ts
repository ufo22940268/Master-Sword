import mongoose from 'mongoose';
import {EndPoint} from '../src/models/EndPoint';
import {ScanLog} from '../src/models/ScanLog';
import {User, UserDocument} from '../src/models/User';
import RequestAgent from './RequestAgent';


describe('ScanLog Api', () => {

    let user: UserDocument;
    let agent: RequestAgent;

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        user = new User();
        user.appleId = 'ijijwef';
        await user.save();

        let endPoint = new EndPoint();
        endPoint.url = 'u2';
        endPoint.user = user;
        await endPoint.save();

        let scanLog = new ScanLog()
        scanLog.endPoint = endPoint;
        scanLog.duration = 3
        await scanLog.save();

        agent = new RequestAgent(user);
    });

    it('should list scanLogs', async () => {
        let r = await agent.get('/scanlog/list')
        expect(r.body.result).toHaveLength(1);
        expect(r.body.result[0]).toHaveProperty('duration', 3);
        expect(r.body.result[0]).toHaveProperty('url', 'u2');
        expect(r.body.result[0]).toHaveProperty('time');
    })
});
