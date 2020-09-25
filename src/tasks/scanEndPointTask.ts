import fetch from "node-fetch"
import {Headers, Request} from 'node-fetch'
import {EndPoint, EndPointDocument} from "../models/endPoint";
import {ScanLog, ScanLogDocument, ScanLogField} from "../models/scanLog";
import {ScanBatch, ScanBatchDocument} from "../models/scanBatch";
import {JSONValidator} from "../util/JSONValidator";
import "../util/initMongo";
import {APNMessage, pushAPNS} from "../util/notification";
import {User} from "../models/user";
import moment from "moment";
import {create} from "domain";
import {getDomain} from "../util/url";

const headersToString = (headers: Headers) => {
    let obj = headers.raw()
    return Object.entries(obj).map(t => `${t[0]}:${t[1]}`).join('\n')
}

export const scanEndPoint = async (endPoint: EndPointDocument, batch?: ScanBatchDocument): Promise<ScanLogDocument> => {
    let startTime = new Date();

    let request = new Request(endPoint.url);
    let response = await fetch(request, {timeout: 5000});

    let log = new ScanLog()
    log.responseHeader = headersToString(response.headers);
    log.requestHeader = '';
    log.batch = batch;
    log.endPoint = endPoint

    let fields: ScanLogField[] = [];
    let text = await response.text();
    let duration = (Date.now() - startTime.getTime()) / 1000;
    let json = null;
    try {
        json = JSON.parse(text)
    } catch (e) {
        console.error(e)
    }

    let errorCount = 0;
    if (json) {
        let jsonValidator = new JSONValidator(json);
        for (let watchField of endPoint.watchFields) {
            let field: ScanLogField
            let {match, value} = jsonValidator.validate(watchField.path, watchField.value);
            if (!match) errorCount += 1;
            field = {expectValue: watchField.value, match, path: watchField.path, value}
            fields.push(field);
        }
    } else {
        fields = endPoint.watchFields.map((watchField): ScanLogField => {
            return {expectValue: watchField.value, match: false, path: watchField.path, value: ""};
        });
        errorCount = endPoint.watchFields.length
    }

    log.errorCount = errorCount;
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

    await ScanLog.populate(log, {path: 'endPoint'})
    let message: APNMessage = {
        content: `域名 ${getDomain(log.endPoint.url)} 有错误`
    }


    await User.populate(log, {path: 'endPoint.user'});
    await pushAPNS(log.endPoint.user, message);
    log.notified = true;
    await log.save();
}

async function isSentRecently(log: ScanLogDocument) {
    let begin = moment(log.createdAt).subtract(10, 'minutes');
    return !!(await ScanLog.findOne({createdAt: {$gt: begin}, notified: true}));
}

export const scanEndPoints = async () => {
    let batch = new ScanBatch();
    await batch.save();
    for (let endPoint of await EndPoint.find()) {
        try {
            let log = await scanEndPoint(endPoint, batch)
            if (log?.hasIssue && !await isSentRecently(log)) {
                await sendNotification(log);
            }
        } catch (e) {
            console.error(e)
        }
    }
};

if (require.main == module) {
    (async () => await scanEndPoints())().finally(() => {
            console.log('finish');
            process.exit(0);
        }
    );
}
