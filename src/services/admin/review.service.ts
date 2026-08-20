import * as reviewRepository from '../../repositories/admin/review.repository';

export const getAllReviewsGlobal = async (page: number, limit: number, keyword: string) => {
    const skip = (page - 1) * limit;

    const { reviews, pagination } = await reviewRepository.getAllReviewsGlobal(page, skip, limit, keyword);

    return { reviews, pagination };
}