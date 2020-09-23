import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import {EndPoint} from '../src/models/EndPoint';
import {User, UserDocument} from '../src/models/User';
import RequestAgent from './RequestAgent';
import '../src/util/initMongo'
import {deleteCollectionsBeforeTest} from "./dbHelper";


describe('User Api', () => {

    let user: UserDocument;
    let agent: RequestAgent;

    beforeEach(async () => {
        await deleteCollectionsBeforeTest()
        user = new User();
        user.appleId = 'id1';
        await user.save();

        let endPoint = new EndPoint();
        endPoint.url = 'u2';
        endPoint.user = user;
        await endPoint.save();

        agent = new RequestAgent(user);
    });

    it('should return error when not passed required variable ', async () => {
        let r = await request(app).post('/user/login')
            .send({});
        expect(r.body).toHaveProperty('ok', false);
    });

    it('login', async () => {
        let r = await request(app).post('/user/login')
            .send({appleUserId: 'id1', notificationToken: 'notif'});
        expect(r.body.result).toHaveProperty('_id', user._id.toString());
        expect(r.body.result).toHaveProperty('notificationToken', 'notif');

        r = await request(app).post('/user/login')
            .send({appleUserId: 'id2', username: 'kk'});
        expect(r.body.result).toHaveProperty('appleId', 'id2');
    });

    it('update notification token', async () => {
        let r = await agent.post('/user/update/notificationtoken')
            .send({notificationToken: 'nt'})
        expect(await User.findOne({_id: user._id})).toHaveProperty('notificationToken', 'nt');
    })
});
