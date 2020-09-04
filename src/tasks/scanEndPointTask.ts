import fetch from "node-fetch"
import {EndPoint, EndPointDocument} from "../models/EndPoint";
import {ScanLogField, ScanLog} from "../models/ScanLog";
import {ScanBatch, ScanBatchDocument} from "../models/scanBatch";
import {JSONValidator} from "../util/JSONValidator";

export const scanEndPoint = async (endPoint: EndPointDocument, batch: ScanBatchDocument) => {
    let response = await fetch(endPoint.url, {timeout: 5000});

    let log = new ScanLog()
    log.batch = batch;
    log.endPoint = endPoint

    let fields: ScanLogField[] = [];
    try {
        let json = await response.json();
        let jsonValidator = new JSONValidator(json);
        let field: ScanLogField
        for (let watchField of endPoint.watchFields) {
            let {match, value} = jsonValidator.validate(watchField.path, watchField.value);
            field = {expectValue: watchField.value, match, path: watchField.path, value}
            fields.push(field);
        }
    } catch (e) {
        console.error(e)
    }

    log.fields = fields
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
