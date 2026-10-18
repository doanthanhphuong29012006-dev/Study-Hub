import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/document.repository", () => ({
    findAllDocument: vi.fn(),
}));

import * as documentRepository from "../../src/repositories/document.repository";
import { getAllDocument } from "../../src/services/document.service";

describe("document.service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
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