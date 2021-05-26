import { getSession } from 'next-auth/client'

// == Import : local
import dbConnect from '../../../utils/dbConnect';
import corsMiddleware from "../../../middlewares/cors";
import House from '../../../models/House';
import Apartment from '../../../models/Apartment';


const handler = async (req, res) => {
    try {
        await corsMiddleware(req, res);
        const session = await getSession({ req })

        if (session) {
            await dbConnect();
            const { method, query: { params } } = req;

            switch (method) {
                case 'GET':
                    const favoritesId = params[0].split(',');
                    const favoritesApartments = await Apartment.find({ '_id': { $in: favoritesId }});
                    const favoritesHouses = await House.find({ '_id': { $in: favoritesId }});

                    const favoritesProperty = {
                        apartments: favoritesApartments,
                        houses: favoritesHouses
                    };

                    if (!favoritesProperty) {
                        return res.status(400).json({ error: 'no match ID' });
                    }
                    res.status(200).json(favoritesProperty);
                    break;
                default: res.status(400).json({ error: 'no match method' });
            }
        } else {
            res.status(401).end();
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};
export default handler;
