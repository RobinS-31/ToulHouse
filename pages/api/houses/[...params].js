// == Import : local
import dbConnect from '../../../utils/dbConnect';
import House from '../../../models/House';


const handler =  async (req, res) => {
    try {
        await dbConnect();
        const {
            query: { params: [type, page, sortField, pcsNbr, priceMin, priceMax, surface] },
            method
        } = req;

        switch (method) {
            case 'GET':
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
            default: res.status(400).json({ error: 'no match method' });
        }

    } catch (err) {
        res.status(400).json({ error: err });
    }
};
export default handler;
