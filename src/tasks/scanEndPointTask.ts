import fetch from "node-fetch"
import {EndPoint, EndPointDocument} from "../models/EndPoint";
import {ScanLogField, ScanLog, ScanLogDocument} from "../models/ScanLog";
import {ScanBatch, ScanBatchDocument} from "../models/scanBatch";
import {JSONValidator} from "../util/JSONValidator";
import "../app";
import {APNMessage, pushAPNS} from "../util/notification";
import {User} from "../models/User";

export const scanEndPoint = async (endPoint: EndPointDocument, batch: ScanBatchDocument): Promise<ScanLogDocument> => {
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
    return await log.save();
}

async function sendNotification(log: ScanLogDocument) {
    let notifFields = log.fields.filter(f => !f.match);
    if (!notifFields.length) {
        return;
    }

    let message: APNMessage = {
        content: `watch value ${notifFields.map(f => f.value).join()} error`
    }

    await User.populate(log, {path: 'endPoint.user'});
    await pushAPNS(log.endPoint.user, message);
}

export const scanEndPoints = async () => {
    let batch = new ScanBatch();
    await batch.save();
    for (let endPoint of await EndPoint.find()) {
        let log = await scanEndPoint(endPoint, batch)
        await sendNotification(log);
    }
};

if (require.main == module) {
    (async () => await scanEndPoints())().finally(() => console.log('finish'));
}
