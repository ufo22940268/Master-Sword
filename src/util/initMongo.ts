// Connect to MongoDB
import {MONGODB_URI} from "./secrets";
import mongoose from "mongoose";
import bluebird from "bluebird";

export const mongoUrl = process.env.CI ? process.env.MONGO_URL : MONGODB_URI;
mongoose.Promise = bluebird;

// mongoose.set('debug', true)

mongoose.connect(mongoUrl, {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false
}).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});


