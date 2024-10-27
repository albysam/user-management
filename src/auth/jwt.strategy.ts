import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // Secret key for JWT
        });
    }

    async validate(payload: any): Promise<User> {
        return this.usersService.findOne(payload.sub); // Validate the user
    }
}
