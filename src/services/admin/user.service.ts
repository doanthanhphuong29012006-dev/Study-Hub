import * as userRepository from '../../repositories/admin/user.repository';

export const getAllUser = async (page: number, limit: number, email: string) => {
    const { users, pagination } = await userRepository.getAllUser(limit, page, email);

    return { users, pagination };
}