// == Import : npm
import mongoose from 'mongoose';

const { Schema } = mongoose;
const UserSchema = new Schema({
    email: {
        type: String
    },
    name: {
        type: String,
        trim: true,
        default: ""
    },
    firstname: {
        type: String,
        trim: true,
        default: ""
    },
    favorites: {
        type: Array,
        default: []
    },
    admin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    emailVerified: {
        type: Date
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

let User;
if (!mongoose?.models?.User) {
    User = mongoose.model('User', UserSchema);
} else {
    User = mongoose.model('User');
}
export default User;
