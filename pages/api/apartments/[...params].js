// == Import : local
import dbConnect from '../../../utils/dbConnect';
import Apartment from '../../../models/Apartment';
import corsMiddleware from "../../../middlewares/cors";


const handler = async (req, res) => {
    try {
        await corsMiddleware(req, res);
        await dbConnect();
        const {
            query: { params: [id, getBy, type, page, sortField, pcsNbr, priceMin, priceMax, surface] },
            method
        } = req;

        switch (method) {
            case 'GET':
                switch (getBy) {
                    case 'RANDOM':
                        try {
                            const apartmentsBuyCount = await Apartment.find({ type: 0 }).countDocuments();
                            const apartmentsLocationCount = await Apartment.find({ type: 1 }).countDocuments();

                            const randomBuy = Math.floor(Math.random() * ((apartmentsBuyCount - 6) - 1 + 1) + 1);
                            const randomLocation = Math.floor(Math.random() * ((apartmentsLocationCount - 6) - 1 + 1) + 1);

                            const randomApartmentsBuy = await Apartment.find({ type: 0 }).skip(randomBuy).limit(6);
                            const randomApartmentsLocation = await Apartment.find({ type: 1 }).skip(randomLocation).limit(6);

                            if (!randomApartmentsBuy || !randomApartmentsLocation) {
                                return res.status(400).json({ error: 'no match getBy argument' });
                            }
                            const randomApartments = [...randomApartmentsBuy, ...randomApartmentsLocation];
                            res.status(200).json(randomApartments);
                        } catch (error) {
                            res.status(400).json({ error: error });
                        }
                        break;
                    case 'LIST':
                        try {
                            const apartmentsListBuy = await Apartment
                                .find({ type })
                                .where("surface").gte(surface)
                                .where("pcsNbr").gte(pcsNbr)
                                .where("price").gte(priceMin).lte(priceMax)
                                .sort({ [sortField]: "asc" })
                                .skip(page * 12)
                                .limit(12);

                            if (!apartmentsListBuy) {
                                return res.status(400).json({ error: 'no match getBy argument' });
                            }
                            res.status(200).json(apartmentsListBuy);
                        } catch (error) {
                            res.status(400).json({ error: error });
                        }
                        break;
                    default: res.status(400).json({ error: 'no match getBy' });
                }
                break;
            default: res.status(400).json({ error: 'no match method' });
        }

    } catch (err) {
        res.status(400).json({ error: err });
    }
};
export default handler;
