export const pagination = (page: number, limit: number, totalCount: any) => {

    const totalPage = Math.ceil(parseInt(totalCount) / limit);

    const currentPage = page || 1

    return { currentPage, totalCount, limit, totalPage};
}       