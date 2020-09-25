import {Request, Response} from 'express';
import routerWrapper from '../util/routerWrapper';
import {User} from '../models/user';
import {check} from 'express-validator';

export const updateNotificationToken = routerWrapper([check('notificationToken').not().isEmpty()], async (req: Request, res: Response) => {
    let {user} = res.locals;
    let {notificationToken} = req.body;
    await User.findOneAndUpdate({_id: user._id}, {notificationToken: notificationToken})
});


export const postLogin = routerWrapper([check('appleUserId').not().isEmpty()], async (req: Request, res: Response) => {
    let {appleUserId, username, notificationToken} = req.body;
    return User.findOneAndUpdate({appleId: appleUserId}, {
        username: username,
        notificationToken: notificationToken
    }, {new: true, upsert: true});
});
