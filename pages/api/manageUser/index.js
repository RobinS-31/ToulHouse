// == Import : npm
import { getSession } from 'next-auth/client';

// == Import : local
import dbConnect from '../../../utils/dbConnect';
import User from "../../../models/User";

export default async (req, res) => {
    try {
        const session = await getSession({ req });

        if (session) {
            await dbConnect();
            const { method, body } = req;

            switch (method) {
                case 'PUT':
                    const updateUser = await User.findByIdAndUpdate(
                        session.user._id,
                        {
                            ...body,
                            updatedAt: new Date()
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    );

                    if (!updateUser) {
                        return res.status(400).json({ error: 'no match ID' });
                    }
                    res.status(200).json(updateUser);

                    break;
                case 'DELETE':
                    const deletedUser = await User.deleteOne({})

                    if (!deletedUser) {
                        return res.status(400).json({ error: 'no match ID' });
                    }
                    res.status(200).json({ message: 'User deleted with succes' });
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
