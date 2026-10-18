import { describe, expect, it } from "vitest";
import { pagination } from "../../src/helpers/pagination.helper";

describe("pagination", () => {
  it("tính tổng số trang và giữ lại trang được yêu cầu", () => {
    expect(pagination(2, 10, "27")).toEqual({
      currentPage: 2,
      totalCount: "27",
      limit: 10,
      totalPage: 3,
    });
  });

  it("dùng trang 1 khi page là 0", () => {
    expect(pagination(0, 10, "0")).toEqual({
      currentPage: 1,
      totalCount: "0",
      limit: 10,
      totalPage: 0,
    });
  });
});