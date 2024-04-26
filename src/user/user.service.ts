import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { rut: createUserDto.rut }],
    });

    if (existingUser) {
      throw new Error('User with this email or rut already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      hashed_password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    return {
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      rut: newUser.rut,
    };
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      rut: user.rut,
    }));
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOneBy({ user_id: id });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      rut: user.rut,
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ user_id: id });
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return {
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      rut: updatedUser.rut,
    };
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.userRepository.delete(id);
    if (!deleteResult.affected) {
      throw new Error(`User with ID ${id} not found`);
    }
  }

  async findByEmail(loginUserDto: LoginUserDto): Promise<Partial<User>> {
    const email = loginUserDto.email;
    const password = loginUserDto.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const passwordMatch = await bcrypt.compare(
      hashedPassword,
      user.hashed_password,
    );
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      rut: user.rut,
    };
  }
}
