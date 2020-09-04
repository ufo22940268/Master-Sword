import fetch from "node-fetch"
import {EndPoint, EndPointDocument} from "../models/EndPoint";
import {ScanLogField, ScanLog} from "../models/ScanLog";
import {ScanBatch, ScanBatchDocument} from "../models/scanBatch";
import {JSONValidator} from "../util/JSONValidator";

export const scanEndPoint = async (endPoint: EndPointDocument, batch: ScanBatchDocument) => {
    let startTime = new Date();

    let response = await fetch(endPoint.url, {timeout: 5000});

    let log = new ScanLog()
    log.batch = batch;
    log.endPoint = endPoint

    let fields: ScanLogField[] = [];
    let text = await response.text();
    let duration = Date.now() - startTime.getTime();
    let json = null;
    try {
        json = JSON.parse(text)
    } catch (e) {
        console.error(e)
    }

    if (json) {
        let jsonValidator = new JSONValidator(json);
        for (let watchField of endPoint.watchFields) {
            let field: ScanLogField
            let {match, value} = jsonValidator.validate(watchField.path, watchField.value);
            field = {expectValue: watchField.value, match, path: watchField.path, value}
            fields.push(field);
        }
    } else {
        fields = endPoint.watchFields.map((watchField): ScanLogField => {
            return {expectValue: watchField.value, match: false, path: watchField.path, value: ""};
        });
    }

    log.duration = duration;
    log.fields = fields
    log.data = text
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
