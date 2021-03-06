import mongoose from 'mongoose';
import {EndPoint, EndPointDocument} from '../src/models/endPoint';
import {ScanLog, ScanLogDocument} from '../src/models/scanLog';
import {User, UserDocument} from '../src/models/user';
import RequestAgent from './requestAgent';
import '../src/util/initMongo'
import {deleteCollectionsBeforeTest} from "./dbHelper";

describe('ScanLog Api', () => {

    let user: UserDocument;
    let agent: RequestAgent;
    let scanLog: ScanLogDocument;
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

        scanLog = new ScanLog()
        scanLog.endPoint = endPoint;
        scanLog.duration = 3
        scanLog.responseHeader = "a"
        scanLog.requestHeader = "a"
        scanLog.data = "a"
        scanLog.statusCode = 123
        await scanLog.save();

        agent = new RequestAgent(user);
    });


    it('should list scanLogs', async () => {
        let r = await agent.get('/scanlog/list')
        expect(r.body.result).toHaveLength(1);
        expect(r.body.result[0]).toHaveProperty('duration', 3);
        expect(r.body.result[0]).toHaveProperty('url', 'u2');
        expect(r.body.result[0]).toHaveProperty('time');
        expect(r.body.result[0]).toHaveProperty('id', expect.anything());
        expect(r.body.result[0]).toHaveProperty('endPointId', expect.anything());
    })

    it('should list scanLogs by endpoint id', async () => {
        let r = await agent.get(`/scanlog/list/${endPoint.id}`)
        expect(r.body.result).toHaveLength(1);
        expect(r.body.result[0]).toHaveProperty('duration', 3);
        expect(r.body.result[0]).toHaveProperty('time');
        expect(r.body.result[0]).toHaveProperty('id', expect.anything());
    })

    it('should get scan log detail', async () => {
        let {body: {result}} = await agent.get(`/scanlog/${scanLog.id}`)
        expect(result).toHaveProperty('responseHeader', expect.anything());
        expect(result).toHaveProperty('requestHeader', expect.anything());
        expect(result).toHaveProperty('responseBody', expect.anything());
        expect(result).toHaveProperty('statusCode', expect.any(Number));
        expect(result).toHaveProperty('time', expect.any(String));
        expect(result).toHaveProperty('duration', expect.any(Number));
    })
});
