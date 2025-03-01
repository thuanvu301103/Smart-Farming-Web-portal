import { Controller, Post, Body, UseGuards, Request, HttpCode  } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("login")
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        return this.authService.login(user);
    }

    @Post("register")
    @HttpCode(200) // Set HTTP Status to be 200 OK
    async register(@Body() body: { username: string; password: string }) {
        return this.authService.register(body.username, body.password);
    }

    @Post("profile")
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return req.user;
    }
}
