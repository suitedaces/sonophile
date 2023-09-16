import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';

let User;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schemas
const artistSchema = new mongoose.Schema({
    name: String,
    rank: Number
});

const songSchema = new mongoose.Schema({
    name: String,
    rank: Number
});

const timeRangeDataSchema = new mongoose.Schema({
    short_term: {
        artists: [artistSchema],
        songs: [songSchema]
    },
    medium_term: {
        artists: [artistSchema],
        songs: [songSchema]
    },
    long_term: {
        artists: [artistSchema],
        songs: [songSchema]
    }
});

const loginSchema = new mongoose.Schema({
    timestamp: Date,
    data: timeRangeDataSchema
});

const userSchema = new mongoose.Schema({
    spotifyId: String,
    name: String,
    logins: [loginSchema]
});

if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    User = mongoose.model('User', userSchema);
}

export { User };
