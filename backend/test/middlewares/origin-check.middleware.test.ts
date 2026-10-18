import { describe, expect, it, vi } from "vitest";
import { requireValidOrigin } from "../../src/middlewares/origin-check.middleware";

const createMocks = (method: string, origin?: string) => ({
    req: {
        method,
        headers: origin ? { origin } : {},
    } as any,
    res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as any,
    next: vi.fn(),
});

describe("requireValidOrigin", () => {
    it("cho GET đi tiếp mà không cần kiểm tra origin", () => {
        const { req, res, next } = createMocks("GET");

        requireValidOrigin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("từ chối POST không có origin", () => {
        const { req, res, next } = createMocks("POST");

        requireValidOrigin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("cho POST từ origin được phép đi tiếp", () => {
        const { req, res, next } = createMocks(
            "POST",
            "http://localhost:5173",
        );

        requireValidOrigin(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});