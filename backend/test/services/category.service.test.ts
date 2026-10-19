import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/config/redis", () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
        del: vi.fn(),
    },
}));

vi.mock("../../src/repositories/category.repository", () => ({
    findAllCategories: vi.fn(),
    getCategoryBySlug: vi.fn(),
    getCategoryByName: vi.fn(),
}));

import redisClient from "../../src/config/redis";
import * as categoryRepository from "../../src/repositories/category.repository";
import {
    getAllCategories,
    invalidateCategoryListCache,
} from "../../src/services/category.service";

describe("category.service Redis cache", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("trả về danh mục từ Redis khi cache hit", async () => {
        const categories = [{ id: "category-1", name: "Toán" }];
        vi.mocked(redisClient.get).mockResolvedValue(JSON.stringify(categories));

        const result = await getAllCategories();

        expect(result).toEqual(categories);
        expect(categoryRepository.findAllCategories).not.toHaveBeenCalled();
    });

    it("đọc PostgreSQL rồi lưu Redis khi cache miss", async () => {
        const categories = [{ id: "category-1", name: "Toán" }];
        vi.mocked(redisClient.get).mockResolvedValue(null);
        vi.mocked(categoryRepository.findAllCategories).mockResolvedValue(categories as any);

        const result = await getAllCategories();

        expect(categoryRepository.findAllCategories).toHaveBeenCalledOnce();
        expect(redisClient.set).toHaveBeenCalledWith(
            "categories:all:v1",
            JSON.stringify(categories),
            { EX: 300 },
        );
        expect(result).toEqual(categories);
    });

    it("vẫn trả dữ liệu từ PostgreSQL nếu Redis lỗi khi đọc cache", async () => {
        const categories = [{ id: "category-1", name: "Toán" }];
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(redisClient.get).mockRejectedValue(new Error("Redis unavailable"));
        vi.mocked(categoryRepository.findAllCategories).mockResolvedValue(categories as any);

        const result = await getAllCategories();

        expect(categoryRepository.findAllCategories).toHaveBeenCalledOnce();
        expect(result).toEqual(categories);
    });

    it("xóa cache danh sách khi được yêu cầu invalidate", async () => {
        await invalidateCategoryListCache();

        expect(redisClient.del).toHaveBeenCalledWith("categories:all:v1");
    });
});
