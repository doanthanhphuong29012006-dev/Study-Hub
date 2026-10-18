import { describe, expect, it, vi } from "vitest";
import { validatePagination } from "../../src/validations/pagination.validate";

const createMocks = (query = {}) => ({
    req: { query } as any,
    res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as any,
    next: vi.fn(),
});

describe("validatePagination", () => {
    it("dùng giá trị mặc định nếu không truyền page và limit", () => {
        const { req, res, next } = createMocks();

        validatePagination(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.query.page).toBe(1);
        expect(req.query.limit).toBe(10);
    });

    it("trả 400 nếu page nhỏ hơn 1", () => {
        const { req, res, next } = createMocks({ page: "0" });

        validatePagination(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it("chấp nhận tham số hợp lệ", () => {
        const { req, res, next } = createMocks({
            page: "2",
            limit: "20",
        });

        validatePagination(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.query.page).toBe(2);
        expect(req.query.limit).toBe(20);
    });
});