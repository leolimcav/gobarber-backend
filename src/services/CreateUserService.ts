import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw Error('Email address already used!');
    }

    const encryptedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: encryptedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}
