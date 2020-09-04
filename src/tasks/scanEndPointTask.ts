import fetch from "node-fetch"
import {EndPoint, EndPointDocument} from "../models/EndPoint";
import {ScanLog} from "../models/ScanLog";
import {ScanBatch, ScanBatchDocument} from "../models/scanBatch";

export const scanEndPoint = async (endPoint: EndPointDocument, batch: ScanBatchDocument) => {
    let response = await fetch(endPoint.url, {timeout: 5000});
    try {
        let json = await response.json();
    } catch (e) {
        // console.error(e)
    }
    let log = new ScanLog()
    // log.duration =
    log.batch = batch;
    log.endPoint = endPoint
    await log.save();
}

export const scanEndPoints = async () => {
    let batch = new ScanBatch();
    await batch.save();
    for (let endPoint of await EndPoint.find()) {
        await scanEndPoint(endPoint, batch)
    }
};

if (require.main == module) {
    (async () => await scanEndPoints())().finally(() => console.log('finish'));
}
