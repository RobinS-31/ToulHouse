import Cors from "cors";

const cors = Cors({
    "origin": process.env.API_IMMO_APP,
    "allowedHeaders": ["Origin", "X-Requested-With", "Content", "Accept", "Content-Type", "Authorization"],
    "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    "credentials": true
});

const corsMiddleware = (req, res) => {
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
};

export default corsMiddleware;
