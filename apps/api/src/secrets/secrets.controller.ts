import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common'
import { SecretsService } from './secrets.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SetSecretDto } from './dto/set-secret.dto'
import { BulkSetSecretsDto } from './dto/bulk-set-secrets.dto'
import { Request } from 'express'

@Controller('projects/:slug/secrets')
@UseGuards(JwtAuthGuard)
export class SecretsController {
  constructor(private secrets: SecretsService) {}

  @Get('environments')
  getEnvironments(@Req() req: any, @Param('slug') slug: string) {
    return this.secrets.getEnvironments(slug, req.user.id)
  }

  @Get(':environment')
  getSecrets(
    @Req() req: any,
    @Param('slug') slug: string,
    @Param('environment') environment: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress
    return this.secrets.getSecrets(slug, environment, req.user.id, ip)
  }

  @Post(':environment')
  setSecret(
    @Req() req: any,
    @Param('slug') slug: string,
    @Param('environment') environment: string,
    @Body() dto: SetSecretDto,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress
    return this.secrets.setSecret(
      slug, environment, dto.key, dto.value, req.user.id, ip,
    )
  }

  @Post(':environment/bulk')
  bulkSet(
    @Req() req: any,
    @Param('slug') slug: string,
    @Param('environment') environment: string,
    @Body() dto: BulkSetSecretsDto,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress
    return this.secrets.bulkSetSecrets(
      slug, environment, dto.secrets, req.user.id, ip,
    )
  }

  @Delete(':environment/:key')
  deleteSecret(
    @Req() req: any,
    @Param('slug') slug: string,
    @Param('environment') environment: string,
    @Param('key') key: string,
  ) {
    const ip = req.ip ?? req.socket.remoteAddress
    return this.secrets.deleteSecret(slug, environment, key, req.user.id, ip)
  }
}