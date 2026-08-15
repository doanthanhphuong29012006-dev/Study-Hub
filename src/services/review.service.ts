import * as reviewRepository from '../repositories/review.repository';

export const createReview = async (rating: number, comment: string, userId: string, documentId: string) => {
    await reviewRepository.createNewReview(rating, comment, userId, documentId);
}

export const getAllReview = async (documentId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const { reviews, pagination } = await reviewRepository.getAllReviewInDocument(documentId, page, skip, limit);
    return { reviews, pagination };
}

export const updateReview = async (reviewId: string, userId: string, rating: number, comment: string) => {
    await reviewRepository.updateReview(reviewId, userId, rating, comment);
}

export const deleteReview = async (reviewId: string, userId: string, userRole: string) => {
    await reviewRepository.deleteReview(reviewId, userId, userRole);
}