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
    if (!redisClient.isReady) {
            await redisClient.connect();
    }

    if (!redisClient.isReady) {
        throw new Error("Redis isn't ready!");
    }
}

export const redisClose = async () => {
    if (redisClient.isOpen) {
        await redisClient.quit();
    }
}

export default redisClient;

