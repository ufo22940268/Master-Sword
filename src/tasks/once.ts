import {pushAPNS} from "../util/notification";
import {User} from "../models/user";
import '../util/initMongo'
import {scanEndPoints} from "./scanEndPointTask";
import {EndPoint} from "../models/endPoint";

(async () => {
    // let user = await User.findOne({notificationToken: {$exists: true}})
    // fe8a4da17517295dc0c6b602cf7c5986165f673c3f59808285ab3f4c25df6ca6

    // @ts-ignore
    await pushAPNS({notificationToken: 'fe8a4da17517295dc0c6b602cf7c5986165f673c3f59808285ab3f4c25df6ca6'}, {content: '123123'})

    // await EndPoint.findOneAndUpdate({url: 'http://biubiubiu.hopto.org:9000/link/github.json'}, {
    //     user: user,
    //     watchFields: [{path: 'feeds_url', value: 'wrong_feeds_url_value'}]
    // }, {upsert: true})
    // await scanEndPoints();
    console.log('success');
})().finally(() => {
    process.exit(0);
})
