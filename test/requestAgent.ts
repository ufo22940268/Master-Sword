import request from 'supertest';
import app from '../src/app';
import {UserDocument} from '../src/models/user';

class RequestAgent {

    user: UserDocument;

    constructor(user: UserDocument) {
        this.user = user;
    }

    post(url: string) {
        return request(app).post(url).query({'token': this.user.appleId});
    }

    get(url: string) {
        return request(app).get(url).query({'token': this.user.appleId});
    }
}

export default RequestAgent;
