import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

export const verifyLogin = async (email: string, password: string) => {
    const existEmail = await userRepository.getUserByEmail(email);

    if (existEmail.rowCount === 0) {
        throw Error("Login_Error");
    }

    const user = existEmail.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw Error("Login_Error");
    }

    const payload = {
        userId: user.id,
        email: email,
        role: user.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '1d'
    });

    delete user.password_hash;

    return { user, token };
}