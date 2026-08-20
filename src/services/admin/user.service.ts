import * as userRepository from '../../repositories/admin/user.repository';

export const getAllUser = async (page: number, limit: number, email: string) => {
    const { users, pagination } = await userRepository.getAllUser(limit, page, email);

    return { users, pagination };
}

export const changeUserStatus = async (userId: string, status: string) => {
    await userRepository.changeUserStatusById(userId, status);
}