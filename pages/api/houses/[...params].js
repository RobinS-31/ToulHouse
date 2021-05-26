// == Import : local
import dbConnect from '../../../utils/dbConnect';
import House from '../../../models/House';
import corsMiddleware from "../../../middlewares/cors";


const handler =  async (req, res) => {
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
                            const housesBuyCount = await House.find({ type: 0 }).countDocuments();
                            const housesLocationCount = await House.find({ type: 1 }).countDocuments();

                            const randomBuy = Math.floor(Math.random() * ((housesBuyCount - 6) - 1 + 1) + 1);
                            const randomLocation = Math.floor(Math.random() * ((housesLocationCount - 6) - 1 + 1) + 1);

                            const randomHousesBuy = await House.find({ type: 0 }).skip(randomBuy).limit(6);
                            const randomHousesLocation = await House.find({ type: 1 }).skip(randomLocation).limit(6);

                            if (!randomHousesBuy || !randomHousesLocation) {
                                return res.status(400).json({ error: 'no match getBy argument' });
                            }
                            const randomHouses = [...randomHousesBuy, ...randomHousesLocation];
                            res.status(200).json(randomHouses);
                        } catch (error) {
                            res.status(400).json({ error: error });
                        }
                        break;
                    case 'LIST':
                        try {
                            const housesListBuy = await House
                                .find({ type })
                                .where("surface").gte(surface)
                                .where("pcsNbr").gte(pcsNbr)
                                .where("price").gte(priceMin).lte(priceMax)
                                .sort({ [sortField]: "asc" })
                                .skip(page * 12)
                                .limit(12);

                            if (!housesListBuy) {
                                return res.status(400).json({ error: 'no match getBy argument' });
                            }
                            res.status(200).json(housesListBuy);
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
