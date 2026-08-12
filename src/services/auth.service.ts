import bcrypt from 'bcryptjs';
import * as userRepository from '../repositories/user.repository';

export const createAccount = async (email: string, fullName: string, password: string) => {
    const existEmail = await userRepository.getUserByEmail(email); 

    if (existEmail.rowCount !== null && existEmail.rowCount > 0) {
        throw Error("Email_Exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    await userRepository.createUser(email, fullName, hash);
}