import mongoose from 'mongoose';

export let deleteCollectionsBeforeTest = async () => {
    let names = Object.keys(mongoose.connection.collections)
    await Promise.all(names.map(async n => {
        try {
            await mongoose.connection.dropCollection(n);
        } catch (e) {

        }
    }))
}
