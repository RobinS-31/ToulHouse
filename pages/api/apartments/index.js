// == Import : local
import dbConnect from '../../../utils/dbConnect';
import Apartment from '../../../models/Apartment';

export const getApartmentsList =  async () => {
    try {
        await dbConnect();
        return await Apartment.find();
    } catch (err) {
        return { error: err };
    }
};

export const getApartmentById = async (id) => {
    try {
        await dbConnect();
        return await Apartment.findById(id);
    } catch (err) {
        return { error: err };
    }
};
