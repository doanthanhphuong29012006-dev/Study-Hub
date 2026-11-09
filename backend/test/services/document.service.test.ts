import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/document.repository", () => ({
    findAllDocument: vi.fn(),
    createNewDocument: vi.fn(),
}));

import * as documentRepository from "../../src/repositories/document.repository";
import { getAllDocument, createDocument } from "../../src/services/document.service";

describe("document.service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gọi repository để tạo tài liệu mới", async () => {
        vi.mocked(documentRepository.createNewDocument).mockResolvedValue(undefined as any);

        await createDocument(
            "https://example.com/tai-lieu.pdf",
            0,
            "application/pdf",
            "Tài liệu Giải tích",
            "Mô tả",
            "cat-1",
            "user-1"
        );

        expect(documentRepository.createNewDocument).toHaveBeenCalledWith(
            "https://example.com/tai-lieu.pdf",
            0,
            "application/pdf",
            "Tài liệu Giải tích",
            "Mô tả",
            "cat-1",
            "user-1"
        );
    });

    it("tính skip và trả kết quả phân trang", async () => {
        const documents = [{ id: "doc-1", title: "Toán" }];

        vi.mocked(documentRepository.findAllDocument).mockResolvedValue({
            documents,
            totalCount: "27",
        } as any);

        const result = await getAllDocument(2, 10);

        expect(documentRepository.findAllDocument).toHaveBeenCalledWith(
            10, 10, undefined, undefined, undefined, undefined,
        );

        expect(result).toEqual({
            documents,
            pagination: {
            currentPage: 2,
            totalCount: "27",
            limit: 10,
            totalPage: 3,
            },
        });
    });
});
