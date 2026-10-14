import * as userRepository from '../../repositories/admin/user.repository';

export const getAllUser = async (page: number, limit: number, email: string) => {
    const { users, pagination } = await userRepository.getAllUser(limit, page, email);

    return { users, pagination };
}

export const changeUserStatus = async (userId: string, status: string, actorId: string) => {
    await userRepository.changeUserStatusById(userId, status, actorId);
}

export const changeUserRole = async (userId: string, role: string, actorId: string) => {
    await userRepository.changeUserRoleById(userId, role, actorId);
}