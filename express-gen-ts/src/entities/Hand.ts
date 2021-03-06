import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        trim: true,
    },
});

export const UserModel = mongoose.model('User', UserSchema);
