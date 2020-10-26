import '../util/initMongo'
import got from "got";
import * as util from "util";

(async () => {
    // let user = await User.findOne({notificationToken: {$exists: true}})
    // fe8a4da17517295dc0c6b602cf7c5986165f673c3f59808285ab3f4c25df6ca6

    // @ts-ignore
    // await pushAPNS({notificationToken: 'fe8a4da17517295dc0c6b602cf7c5986165f673c3f59808285ab3f4c25df6ca6'}, {content: '123123'})

    // await EndPoint.findOneAndUpdate({url: 'http://biubiubiu.hopto.org:9000/link/github.json'}, {
    //     user: user,
    //     watchFields: [{path: 'feeds_url', value: 'wrong_feeds_url_value'}]
    // }, {upsert: true})
    // await scanEndPoints();

    let res = await got("http://biubiubiu.biz/link/github.json")
    // let res = await rp({uri: 'http://biubiubiu.biz/link/github.json', time: true, method: 'get'})
    console.log('success');
})()
    .catch(e => {
      console.error(e)
    })
    .finally(() => {
    process.exit(0);
})
