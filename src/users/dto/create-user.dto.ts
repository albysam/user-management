// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'The name of the user' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'The email of the user', uniqueItems: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'The password of the user', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}
