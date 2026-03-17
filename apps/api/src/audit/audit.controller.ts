import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { AuditService } from './audit.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PrismaService } from '../prisma/prisma.service'

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(
    private audit: AuditService,
    private prisma: PrismaService,
  ) {}

  @Get('me')
  getMyLogs(
    @Req() req: any,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.audit.getLogsForUser(req.user.id, Math.min(limit, 200))
  }

  @Get('project/:slug')
  async getProjectLogs(
    @Req() req: any,
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    const project = await this.prisma.project.findUnique({ where: { slug } })
    if (!project) throw new NotFoundException('Project not found')

    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: req.user.id,
        },
      },
    })
    if (!member)
      throw new ForbiddenException('You are not a member of this project')

    return this.audit.getLogsForProject(project.id, Math.min(limit, 500))
  }
}