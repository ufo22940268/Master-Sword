import {EndPoint} from "../models/EndPoint";
import {ScanLog} from "../models/ScanLog";
import "../util/initMongo";
import moment from 'moment'


let mockScanLogTask = async (endPointId: string) => {
    const endPoint = await EndPoint.findById(endPointId);
    await ScanLog.deleteMany({endPoint: endPointId});

    for (let i = 20; i > 0; i--) {
        let date = moment().subtract(5 * i, "minute");
        let scanLog = new ScanLog();
        scanLog.endPoint = endPoint;
        scanLog.duration = Math.random() * 100;
        scanLog.createdAt = date.toDate();
        scanLog.requestHeader = `
        CONNECT bolt.dropbox.com:443 HTTP/1.1
Host: bolt.dropbox.com
Proxy-Connection: keep-alive
        `
        scanLog.responseHeader = `
        CONNECT bolt.dropbox.com:443 HTTP/1.1
Host: bolt.dropbox.com
Proxy-Connection: keep-alive
        `
        scanLog.data = `
        {
  "feeds_urlonline": "https://api.github.com/feeds",
  "followers_url": "https://api.github.com/user/followers"
}
        `;
        await scanLog.save();
    }
}

if (require.main == module) {
    (async () => {
        const endPoint = await EndPoint.findOne().sort({updatedAt: -1})
        await mockScanLogTask(endPoint.id);
    })().finally(() => console.log('finish'));
}
