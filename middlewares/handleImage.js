// == Import : npm
import { mkdir, readdir, rmdir, unlink } from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

// == Import : local
import upload from "../utils/multerConfig";


const handleImage = (req, res, objectId) => {
    const removePictures = async (id, images, reject) => {
        const files = await readdir(path.join(process.cwd(), `public/pictures/${id}`));

        const imagesNames = images.map(reqFile => {
            const termToRemove = `/pictures/${id}/`;
            return reqFile.original.slice(termToRemove.length, reqFile.original.indexOf("_"));
        });

        const filesFilter = files.filter(file => {
            const fileName = file.slice(0, file.lastIndexOf('_'));
            if (!imagesNames.includes(fileName)) {
                return true;
            }
        })

        await Promise.all(
            filesFilter.map(async file => {
                await unlink(path.join(process.cwd(), `public/pictures/${id}/${file}`));
            })
        )
    };

    return new Promise((resolve, reject) => {
        upload(req, res, err => {
            (async () => {
                try {
                    if (!req.files || req.files.length === 0) {
                        if (req.method === "PUT") {
                            const infoData = JSON.parse(req.body.infoData);
                            const { id, images } = infoData;
                            await removePictures(id, images);
                        }
                        if (req.method === "DELETE") {
                            const { id } = req.query;
                            await rmdir(path.join(process.cwd(), `public/pictures/${id}`), { recursive: true })
                        }
                    } else {
                        const infoData = JSON.parse(req.body.infoData);
                        const id = infoData.id ? infoData.id : objectId;
                        const { images } = infoData;

                        if (req.method === "POST") {
                            await mkdir(path.join(process.cwd(), `public/pictures/${id}`), { recursive: false });
                        }
                        if (req.method === "PUT") {
                            await removePictures(id, images);
                        }

                        await Promise.all(
                            Array.from(req.files).map(async file => {
                                const sharpStream = sharp(file.buffer,{
                                    failOnError: false,
                                    density: 96
                                });

                                const promises = [];
                                promises.push(
                                    sharpStream
                                        .clone()
                                        .webp({ quality: 80 })
                                        .toFile(path.join(process.cwd(), `public/pictures/${id}/${file.originalname.split('.')[0]}_original.webp`))
                                );
                                promises.push(
                                    sharpStream
                                        .clone()
                                        .resize({ height: 200 })
                                        .webp({ quality: 80 })
                                        .toFile(path.join(process.cwd(), `public/pictures/${id}/${file.originalname.split('.')[0]}_h200.webp`))
                                );
                                promises.push(
                                    sharpStream
                                        .clone()
                                        .resize({ height: 142 })
                                        .webp({ quality: 80 })
                                        .toFile(path.join(process.cwd(), `public/pictures/${id}/${file.originalname.split('.')[0]}_h142.webp`))
                                );
                                await Promise.all(promises);
                            })
                        );
                    }
                    return resolve();
                } catch (err) {
                    return reject(err);
                }
            })();
        })
    })
};

export default handleImage;
