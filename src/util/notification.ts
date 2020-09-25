import {UserDocument} from "../models/User";
import apn from 'apn'
import * as path from "path";

export interface APNMessage {
    content: string
}

let service = new apn.Provider({
    cert: path.join(__dirname, '../../keys/cert.pem'),
    key: path.join(__dirname, '../../keys/apns-dev-cert.pem'),
    // production: process.env.NODE_ENV == 'production'
    production: false
});

export const pushAPNS = async (user: UserDocument, message: APNMessage) => {
    let {notificationToken} = user
    if (!notificationToken) return;

    let note = new apn.Notification()
    note.alert = message.content;
    note.topic = 'com.bettycc.Link'


    const r = await service.send(note, [notificationToken])
    console.log('r: ' + JSON.stringify(r, null, 4) + '\n');
};
