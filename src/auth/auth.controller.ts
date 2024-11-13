import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../schemas/user.schema';

interface LoginResponse {
    message: string;
    user: User;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('log')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const user = await this.authService.validateUser(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('not found');
        }
        return { message: 'Login successful', user };
    }
}