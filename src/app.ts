import express from 'express';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import mongo from 'connect-mongo';
import flash from 'express-flash';
import mongoose from 'mongoose';
import passport from 'passport';
import bluebird from 'bluebird';
import {MONGODB_URI, SESSION_SECRET} from './util/secrets';
import {User} from './models/User';
import * as EndPointController from './controllers/endPointController';
import * as UserController from './controllers/userController';
import * as ScanLogController from './controllers/scanLogController';
import routerWrapper from './util/routerWrapper';

const MongoStore = mongo(session);

// Create Express server
const app = express();

import './util/initMongo'
import {mongoUrl} from "./util/initMongo";

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());

//@ts-ignore
app.get('/test', routerWrapper(async (req, res) => {
    await Promise.reject('iiijj');
    res.send('test .......');
}));

app.post('/user/login', UserController.postLogin);

app.use(async (req, res, next) => {
    const user = await User.findOne({appleId: req.headers['apple-user-id']});
    if (!user) {
        return res.send({
            ok: false,
            error: 'User not found'
        });
    }

    res.locals.user = user;
    next();
});

app.post('/user/update/notificationtoken', UserController.updateNotificationToken);

app.post('/endpoint/upsert', EndPointController.postUpsertEndPoint);
app.post('/endpoint/delete', EndPointController.postDeleteEndPoint);

app.get('/scanlog/list', ScanLogController.getListScanLogs);


export default app;
