// == Import : npm
import mongoose from 'mongoose';

const connection = {};
const dbConnect = async () => {
    if (connection.isConnected) {
        console.log('Already connected !');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        connection.isConnected = db.connections[0].readyState; // 0 ou 1
        console.log('Connexion à MongoDB Réussie !');
    } catch (error) {
        console.log('Connexion à MongoDB échouée !', error);
    }
};

export default dbConnect;
