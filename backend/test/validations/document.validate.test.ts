import { describe, expect, it, vi } from "vitest";
import { createDocumentValidation } from "../../src/validations/document.validate";

const createMocks = (body = {}) => ({
    req: { body, file: undefined } as any,
    res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as any,
    next: vi.fn(),
});

describe("createDocumentValidation", () => {
    it("từ chối khi thiếu tiêu đề", () => {
        const { req, res, next } = createMocks({
            categoryId: "123e4567-e89b-42d3-a456-426614174000",
        });

        createDocumentValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it("cho tài liệu có dữ liệu hợp lệ đi tiếp", () => {
        const { req, res, next } = createMocks({
            title: "Tài liệu Toán",
            description: "Ôn tập",
            categoryId: "123e4567-e89b-42d3-a456-426614174000",
        });

        createDocumentValidation(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});