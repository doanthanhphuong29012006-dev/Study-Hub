import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/document.service", () => ({
    createDocument: vi.fn(),
    getAllDocument: vi.fn(),
    getDetailDocument: vi.fn(),
    downloadDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
}));

vi.mock("cloudinary", () => ({
    v2: {
        uploader: {
            upload: vi.fn(),
            destroy: vi.fn(),
        },
    },
}));

import * as documentService from "../../src/services/document.service";
import { createDocument } from "../../src/controllers/document.controller";

describe("document.controller createDocument", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("tạo tài liệu thành công khi gửi liên kết (link) mà không cần upload file", async () => {
        const req: any = {
            user: { id: "user-123" },
            body: {
                title: "Tài liệu React và Node.js",
                description: "Tài liệu học online",
                categoryId: "cat-123",
                link: "https://drive.google.com/file/d/test12345/view",
            },
            file: undefined,
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        vi.mocked(documentService.createDocument).mockResolvedValue(undefined as any);

        await createDocument(req, res);

        expect(documentService.createDocument).toHaveBeenCalledWith(
            "https://drive.google.com/file/d/test12345/view",
            0,
            "link",
            "Tài liệu React và Node.js",
            "Tài liệu học online",
            "cat-123",
            "user-123"
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Tải tài liệu lên thành công!",
            data: { fileUrl: "https://drive.google.com/file/d/test12345/view" },
        });
    });

    it("tạo tài liệu thành công khi gửi link hình ảnh mà không cần upload file", async () => {
        const req: any = {
            user: { id: "user-123" },
            body: {
                title: "Infographic Cấu trúc Dữ liệu",
                description: "Sơ đồ cây nhị phân",
                categoryId: "cat-123",
                fileUrl: "https://example.com/tree-diagram.png",
            },
            file: undefined,
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        vi.mocked(documentService.createDocument).mockResolvedValue(undefined as any);

        await createDocument(req, res);

        expect(documentService.createDocument).toHaveBeenCalledWith(
            "https://example.com/tree-diagram.png",
            0,
            "image/png",
            "Infographic Cấu trúc Dữ liệu",
            "Sơ đồ cây nhị phân",
            "cat-123",
            "user-123"
        );
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("báo lỗi 400 khi không có file cũng không có link hoặc hình ảnh", async () => {
        const req: any = {
            user: { id: "user-123" },
            body: {
                title: "Tài liệu trống",
                description: "",
                categoryId: "cat-123",
            },
            file: undefined,
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        await createDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Vui lòng đính kèm tệp tin, liên kết hoặc hình ảnh!",
        });
    });
});
