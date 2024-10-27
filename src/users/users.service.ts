import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    // Create a new user
    async createUser(userData: CreateUserDto): Promise<User> {
        // Check if the email already exists
        const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new ConflictException('Email already exists'); // Handle duplicate email
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 10); // Hash the password

        // Create a new user entity
        const newUser = this.usersRepository.create({
            ...userData,
            password: hashedPassword, // Store the hashed password
        });

        // Save the user to the database
        return this.usersRepository.save(newUser); // Save and return the new user
    }

    // Retrieve all users
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    // Retrieve a single user by ID
    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // Update user details
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id); // Ensure the user exists
        Object.assign(user, updateUserDto); // Update user properties
        return this.usersRepository.save(user); // Save updated user
    }

    // Delete a user by ID
    async deleteUser(id: number): Promise<boolean> {
        const result = await this.usersRepository.delete(id);
        return result.affected > 0; // Returns true if a user was deleted
    }

    // Find a user by email (for authentication)
    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
}
