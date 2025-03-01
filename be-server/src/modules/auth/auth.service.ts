import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.validateUser(username, password);
        if (!user) throw new UnauthorizedException("Invalid credentials");
        return user;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }

    async register(username: string, password: string) {
        return this.usersService.createUser(username, [], null, password);
    }
}
