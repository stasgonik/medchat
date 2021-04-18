import io from 'socket.io-client';
import {configs} from "./config";

const socket = io(configs.REACT_APP_API_URL);

export default socket;
