// == Import : npm
import mongoose from 'mongoose';
import { getSession } from 'next-auth/client';

// == Import : local
import dbConnect from '../../../utils/dbConnect';
import corsMiddleware from "../../../middlewares/cors";
import handleImage from "../../../middlewares/handleImage";
import Apartment from '../../../models/Apartment';
import House from '../../../models/House';


export default async (req, res) => {
    try {
        await corsMiddleware(req, res);
        const session = await getSession({ req });

        if (session.user.admin) {
            await dbConnect();
            const { method } = req;

            switch (method) {
                case 'GET':
                    try {
                        const housesList = await House.find();
                        const apartmentsList = await Apartment.find();

                        if (!housesList || !apartmentsList) {
                            return res.status(400).json({ error: 'Récupération des propriétés impossible' });
                        }

                        const properties = {
                            housesList,
                            apartmentsList
                        };

                        res.status(200).json(properties);

                    } catch (err) {
                        res.status(400).json({ error: err });
                    }
                    break;
                case 'POST':
                    try {
                        const objectId = mongoose.Types.ObjectId();
                        await handleImage(req, res, objectId);

                        const infoData = JSON.parse(req.body.infoData);
                        const { category } = infoData;

                        const propertyData = { _id: objectId, ...infoData};
                        delete propertyData.category;

                        const imageUrl = await Promise.all(
                            Array.from(req.files).map(imageData => {
                                const name = imageData.originalname.split(".");
                                return {
                                    original: `/pictures/${objectId}/${name[0]}_original.webp`,
                                    h200: `/pictures/${objectId}/${name[0]}_h200.webp`,
                                    h142: `/pictures/${objectId}/${name[0]}_h142.webp`
                                };
                            })
                        );
                        propertyData.images = [...imageUrl];

                        let newProperty;
                        if (category === "apartment") newProperty = await Apartment.create(propertyData);
                        if (category === "house") newProperty = await House.create(propertyData);

                        res.status(201).json(newProperty);
                    } catch (err) {
                        res.status(400).json({ error: err });
                    }
                    break;
                case 'PUT':
                    try {
                        await handleImage(req, res);

                        const infoData = JSON.parse(req.body.infoData);
                        const { id, category } = infoData;

                        const propertyData = {...infoData};
                        delete propertyData.id;
                        delete propertyData.category;

                        if (req.files.length) {
                            const newImages = await Promise.all(
                                Array.from(req.files).map(imageData => {
                                    const name = imageData.originalname.split(".");
                                    return {
                                        original: `/pictures/${id}/${name[0]}_original.webp`,
                                        h200: `/pictures/${id}/${name[0]}_h200.webp`,
                                        h142: `/pictures/${id}/${name[0]}_h142.webp`
                                    };
                                })
                            )
                            propertyData.images = [...propertyData.images, ...newImages];
                        }

                        let newProperty;
                        if (category === "apartment") {
                            newProperty = await Apartment.findByIdAndUpdate(id, propertyData, {
                                new: true,
                                runValidators: true
                            });
                        }
                        if (category === "house") {
                            newProperty = await House.findByIdAndUpdate(id, propertyData, {
                                new: true,
                                runValidators: true
                            });
                        }

                        if (!newProperty) {
                            return res.status(400).json({ error: 'no match ID' });
                        }
                        res.status(200).json(newProperty);

                    } catch (err) {
                        res.status(400).json({ error: err });
                    }
                    break;
                case 'DELETE':
                    try {
                        await handleImage(req, res);
                        const { id, category } = req.query;

                        let propertyDeleted;
                        if (category === "apartment") propertyDeleted = await Apartment.deleteOne({ _id: id });
                        if (category === "house") propertyDeleted = await House.deleteOne({ _id: id });

                        if (propertyDeleted.deletedCount !== 1) {
                            return res.status(400).json({ error: 'no match ID' });
                        }
                        res.status(200).json({ message: 'supprimé'});
                    } catch (err) {
                        res.status(400).json({ error: err });
                    }
                    break;
                default: res.status(400).json({ error: 'no match method' });
            }
        } else {
            res.status(401).end();
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
};
