import prisma from "../config/prisma";

// Truy vấn tất cả danh mục bằng Prisma ORM (thay thế cho: SELECT * FROM categories)
export const findAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
};

// Tìm danh mục theo slug bằng Prisma ORM (thay thế cho: SELECT * FROM categories WHERE slug = $1)
export const getCategoryBySlug = async (slug: string) => {
    return await prisma.category.findUnique({
        where: { slug }
    });
};

// Tìm danh mục theo tên bằng Prisma ORM (thay thế cho: SELECT * FROM categories WHERE name = $1)
export const getCategoryByName = async (name: string) => {
    return await prisma.category.findUnique({
        where: { name }
    });
};
