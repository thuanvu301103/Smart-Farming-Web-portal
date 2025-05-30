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
        //console.log(user);
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
            user_id: (user._id).toString(),
            profile_image: user.profile_image
        };
    }

    async register(username: string, password: string) {
        return this.usersService.createUser(username, [], null, password);
    }
}
