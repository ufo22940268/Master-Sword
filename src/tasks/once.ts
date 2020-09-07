import {pushAPNS} from "../util/notification";
import {User} from "../models/User";
import '../app'

(async () => {
    console.log('1111')
    let user = await User.findOne({notificationToken: {$exists: true}})
    await pushAPNS(user, {content: '123123'})
    console.log(22222)
})()
//     .then(() => {
//     console.log('success');
//     process.exit(0);
// }, (e) => {
//     console.log('e: ' + JSON.stringify(e, null, 4) + '\n');
// }).catch(e => {
//     console.error(e);
//     process.exit(-1)
// }).finally(() => {
//     console.log(222222)
// })
