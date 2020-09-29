import express from 'express';
import bodyParser from 'body-parser';
import {User} from './models/user';
import * as EndPointController from './controllers/endPointController';
import * as UserController from './controllers/userController';
import * as ScanLogController from './controllers/scanLogController';
import './util/initMongo'

// Create Express server
const app = express();

app.set('etag', false)
// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/user/login', UserController.postLogin);

app.use(async (req, res, next) => {
    const user = await User.findOne({appleId: req.query['token']});
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
app.post('/endpoint/sync', EndPointController.postSyncEndPoints);
app.get('/endpoint/sync/list', EndPointController.getListEndPointForSync);
app.post('/endpoint/delete', EndPointController.postDeleteEndPoint);
app.post('/endpoint/scan', EndPointController.postScanEndPoint);

app.get('/scanlog/list', ScanLogController.listScanLogs);
app.get('/scanlog/list/:endPointId', ScanLogController.listScanLogsByEndPoint);
app.get('/scanlog/:id', ScanLogController.getScanLog);

app.use((req, res, next) => {
    if (process.env.TEST) {
        console.error('404 not found');
    }
    next()
});

export default app;
