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
import { ProjectsService } from './projects.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateProjectDto } from './dto/create-project.dto'
import { InviteMemberDto } from './dto/invite-member.dto'

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateProjectDto) {
    const ip = req.ip || req.socket.remoteAddress
    return this.projects.create(req.user.id, dto.name, dto.slug, ip)
  }

  @Get()
  findAll(@Req() req: any) {
    return this.projects.findAllForUser(req.user.id)
  }

  @Get(':slug')
  findOne(@Req() req: any, @Param('slug') slug: string) {
    return this.projects.findOne(slug, req.user.id)
  }

  @Delete(':slug')
  delete(@Req() req: any, @Param('slug') slug: string) {
    const ip = req.ip || req.socket.remoteAddress
    return this.projects.delete(slug, req.user.id, ip)
  }

  @Post(':slug/members')
  invite(
    @Req() req: any,
    @Param('slug') slug: string,
    @Body() dto: InviteMemberDto,
  ) {
    const ip = req.ip || req.socket.remoteAddress
    return this.projects.inviteMember(slug, req.user.id, dto.email, dto.role, ip)
  }

  @Delete(':slug/members/:memberId')
  removeMember(
    @Req() req: any,
    @Param('slug') slug: string,
    @Param('memberId') memberId: string,
  ) {
    const ip = req.ip || req.socket.remoteAddress
    return this.projects.removeMember(slug, req.user.id, memberId, ip)
  }
}