// == Import : local
import dbConnect from '../../../utils/dbConnect';
import Apartment from '../../../models/Apartment';


const handler = async (req, res) => {
    try {
        await dbConnect();
        const {
            query: { params: [type, page, sortField, pcsNbr, priceMin, priceMax, surface] },
            method
        } = req;

        switch (method) {
            case 'GET':
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
            default: res.status(400).json({ error: 'no match method' });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
};
export default handler;
