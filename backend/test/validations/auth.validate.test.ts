import { describe, expect, it, vi } from "vitest";
import {
    registerValidation,
    loginValidation,
} from "../../src/validations/auth.validate";

const createMocks = (body = {}) => ({
    req: { body } as any,
    res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as any,
    next: vi.fn(),
});

describe("registerValidation", () => {
    it("từ chối email sai định dạng", () => {
        const { req, res, next } = createMocks({
            fullName: "Nguyen Van A",
            email: "email-sai",
            password: "Password1!",
        });

        registerValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it("cho dữ liệu hợp lệ đi tiếp", () => {
        const { req, res, next } = createMocks({
            fullName: "Nguyen Van A",
            email: "a@example.com",
            password: "Password1!",
        });

        registerValidation(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});

describe("loginValidation", () => {
    it("từ chối khi thiếu mật khẩu", () => {
        const { req, res, next } = createMocks({
            email: "a@example.com",
        });

        loginValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});