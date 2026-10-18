import { describe, expect, it, vi } from "vitest";
import { requirePermission } from "../../src/middlewares/authorize.middleware";

describe("requirePermission", () => {
    it("cho admin đi tiếp", () => {
        const req = { user: { role: "admin" } } as any;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as any;
        const next = vi.fn();

        requirePermission(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("trả 403 với người không phải admin", () => {
        const req = { user: { role: "student" } } as any;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as any;
        const next = vi.fn();

        requirePermission(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});