import {EndPoint} from "../models/EndPoint";
import {ScanLog} from "../models/ScanLog";
import "../util/initMongo";
import moment from 'moment'


let mockScanLogTask = async (endPointId: string) => {
    const endPoint = await EndPoint.findById(endPointId);
    await ScanLog.deleteMany({endPoint: endPointId});

    for (let i = 20; i > 0; i--) {
        let date = moment().subtract(5*i, "minute");
        let scanLog = new ScanLog();
        scanLog.endPoint = endPoint;
        scanLog.duration = Math.random() * 100;
        scanLog.createdAt = date.toDate();
        await scanLog.save();
    }
}

if (require.main == module) {
    (async () => {
        const endPoint = await EndPoint.findOne().sort({updatedAt: -1})
        await mockScanLogTask(endPoint.id);
    })().finally(() => console.log('finish'));
}
