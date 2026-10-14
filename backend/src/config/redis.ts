import { error } from "node:console";
import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error("Lỗi kết nối redis: ", err);
});

redisClient.on('connect', () => {
    console.log("Đang kết nối tới redis...");
});

redisClient.on('ready', () => {
    console.log("Kết nối tới redis thành công!")
});

export const redisConnect = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error('Lỗi kết nối tới redis: ', error);
    }
}

export default redisClient;

