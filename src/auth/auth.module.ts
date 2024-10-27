import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
@Module({
    imports: [
        UsersModule, // Import UsersModule to access user-related functionality
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key', // Replace with your secret key
            signOptions: { expiresIn: '1h' }, // Token expiration time
        }),
    ],
    providers: [AuthService, JwtStrategy], // Include the JWT strategy
    controllers: [AuthController],
    
})
export class AuthModule {}
