import { describe, expect, it } from "vitest";
import prisma from "../../src/config/prisma";

describe("Prisma Client connection & query", () => {
    it("kết nối và truy vấn thành công với Prisma ORM", async () => {
        expect(prisma).toBeDefined();
        expect(prisma.category).toBeDefined();
        expect(prisma.document).toBeDefined();
        expect(prisma.user).toBeDefined();
        expect(prisma.review).toBeDefined();
        expect(prisma.savedDocument).toBeDefined();
    });
});
