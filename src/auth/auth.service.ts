import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt'; // Import bcrypt

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginUserDto: LoginUserDto) {
        // Validate the user credentials
        const user = await this.usersService.findOneByEmail(loginUserDto.email);
        if (!user || !(await this.validatePassword(loginUserDto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials'); // NestJS best practice for unauthorized errors
        }

        // If valid, return the access token
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        // Use bcrypt.compare to validate the password
        return await bcrypt.compare(password, hashedPassword);
    }
}
