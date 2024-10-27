import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')  // Tags all endpoints in this controller under 'users'
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been created.' })
    @ApiResponse({ status: 409, description: 'Email already in use.' })
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.usersService.createUser(createUserDto);
        } catch (error) {
            // Check if the error is due to a unique constraint violation
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Email already in use.');
            }
            throw error; // Rethrow unexpected errors
        }
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({ status: 200, description: 'List of all users' })
    async findAll() {
        return await this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a user by ID' })
    @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: number) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, description: 'User has been updated' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        const updatedUser = await this.usersService.updateUser(id, updateUserDto);
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return updatedUser;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 204, description: 'User has been deleted' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async remove(@Param('id') id: number) {
        const result = await this.usersService.deleteUser(id);
        if (!result) {
            throw new NotFoundException('User not found');
        }
    }
    
}
