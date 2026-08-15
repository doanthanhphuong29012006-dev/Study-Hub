import * as reviewRepository from '../repositories/review.repository';

export const createReview = async (rating: number, comment: string, userId: string, documentId: string) => {
    await reviewRepository.createNewReview(rating, comment, userId, documentId);
}