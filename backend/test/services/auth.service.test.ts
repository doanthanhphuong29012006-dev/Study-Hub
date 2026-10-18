import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/user.repository", () => ({
    getUserByEmail: vi.fn(),
    createUser: vi.fn(),
}));

import * as userRepository from "../../src/repositories/user.repository";
import {
    createAccount,
    verifyLogin,
} from "../../src/services/auth.service";

describe("auth.service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("không tạo tài khoản nếu email đã tồn tại", async () => {
        vi.mocked(userRepository.getUserByEmail).mockResolvedValue({
            rowCount: 1,
        } as any);

        await expect(
            createAccount("a@example.com", "Nguyen Van A", "Password1!"),
        ).rejects.toThrow("Email_Exist");

        expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it("từ chối đăng nhập nếu không tìm thấy email", async () => {
        vi.mocked(userRepository.getUserByEmail).mockResolvedValue({
            rowCount: 0,
            rows: [],
        } as any);

        await expect(
            verifyLogin("missing@example.com", "Password1!"),
        ).rejects.toThrow("Login_Error");
    });
});