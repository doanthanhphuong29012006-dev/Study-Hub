import * as userRepository from '../repositories/user.repository';

export const getInfoUser = async (userId: string) => {
    const data  = await userRepository.getInfoUserById(userId);

    return data;
}

export const updateInfoUser = async (userId: string, fullName?: string, avatar?: string) => {
    await userRepository.updateInfoUserById(userId, fullName, avatar);
}

export const getMyDocument = async (userId: string) => {
    const documents = await userRepository.getMyDocument(userId);

    return documents;
}