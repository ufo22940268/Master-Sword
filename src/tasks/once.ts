import {pushAPNS} from "../util/notification";
import {User} from "../models/User";
import '../util/initMongo'
import {scanEndPoints} from "./scanEndPointTask";
import {EndPoint} from "../models/EndPoint";

(async () => {
    let user = await User.findOne({notificationToken: {$exists: true}})
    // await pushAPNS(user, {content: '123123'})

    await EndPoint.findOneAndUpdate({url: 'http://biubiubiu.hopto.org:9000/link/github.json'}, {
        user: user,
        watchFields: [{path: 'feeds_url', value: 'wrong_feeds_url_value'}]
    }, {upsert: true})
    await scanEndPoints();
    console.log('success');
})().finally(() => {
    process.exit(0);
})
