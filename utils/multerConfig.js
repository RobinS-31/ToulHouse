import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('propertyPic');

export default upload;