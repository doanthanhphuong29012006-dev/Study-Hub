import * as categoryRepository from "../repositories/category.repository";
import redisClient from "../config/redis";

const CATEGORY_LIST_CACHE_KEY = "categories:all:v1";
const CATEGORY_LIST_CACHE_TTL_SECONDS = 5 * 60;

export const getAllCategories = async () => {
    // Cache-aside: thử đọc Redis trước, nếu miss/lỗi thì lấy từ PostgreSQL.
    try {
        const cachedCategories = await redisClient.get(CATEGORY_LIST_CACHE_KEY);

        if (cachedCategories !== null) {
            try {
                return JSON.parse(cachedCategories);
            } catch (error) {
                console.error("Không thể đọc cache danh mục từ Redis:", error);
            }
        }
    } catch (error) {
        console.error("Lỗi đọc cache danh mục từ Redis:", error);
    }

    const categories = await categoryRepository.findAllCategories();

    try {
        await redisClient.set(
            CATEGORY_LIST_CACHE_KEY,
            JSON.stringify(categories),
            { EX: CATEGORY_LIST_CACHE_TTL_SECONDS }
        );
    } catch (error) {
        console.error("Lỗi ghi cache danh mục vào Redis:", error);
    }

    return categories;
}

export const invalidateCategoryListCache = async () => {
    try {
        await redisClient.del(CATEGORY_LIST_CACHE_KEY);
    } catch (error) {
        console.error("Lỗi xóa cache danh mục khỏi Redis:", error);
    }
}

export const getDetailCategory = async (slug: string) => {
    const category = await categoryRepository.getCategoryBySlug(slug);
    return category;
}
