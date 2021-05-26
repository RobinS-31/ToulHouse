// == Import : local
import dbConnect from '../../../utils/dbConnect';
import House from '../../../models/House';

export const getHousesList = async () => {
    try {
        await dbConnect();
        return await House.find();
    } catch (err) {
        return { error: err };
    }
};

export const getHouseById = async (id) => {
    try {
        await dbConnect();
        return await House.findById(id)
    } catch (err) {
        return { error: err };
    }
};
