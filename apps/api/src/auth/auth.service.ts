import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, displayName: string) {
    const user = await this.users.create(email, password, displayName)
    const token = this.signToken(user.id, user.email)
    return { user, token }
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const { passwordHash, ...safeUser } = user
    const token = this.signToken(user.id, user.email)
    return { user: safeUser, token }
  }

  private signToken(userId: string, email: string) {
    return this.jwt.sign({ sub: userId, email })
  }
}