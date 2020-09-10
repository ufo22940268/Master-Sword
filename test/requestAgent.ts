import request from 'supertest';
import app from '../src/app';
import {UserDocument} from '../src/models/User';

class RequestAgent {

    user: UserDocument;

    constructor(user: UserDocument) {
        this.user = user;
    }

    post(url: string) {
        return request(app).post(url).set('apple-user-id', this.user.appleId);
    }

    get(url: string) {
        return request(app).get(url).set('apple-user-id', this.user.appleId);
    }
}

export default RequestAgent;
