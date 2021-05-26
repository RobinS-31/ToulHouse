// == Import : npm
import api from "./axiosConfig";

const fetcher = url => api.get(url).then(res => res.data);

export default fetcher;
