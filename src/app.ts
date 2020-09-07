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
import routerWrapper from './util/routerWrapper';

const MongoStore = mongo(session);

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false
}).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

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

app.post('/endpoint/upsert', EndPointController.postUpsertEndPoint);
app.post('/endpoint/delete', EndPointController.postDeleteEndPoint);


export default app;
