import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from '../../generated/prisma/browser'
import { AuditAction, AuditService } from 'src/audit/audit.service'

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async create(userId: string, name: string, slug: string, ipAddress?: string) {
    const existing = await this.prisma.project.findUnique({ where: { slug } })
    if (existing) throw new ConflictException('Slug already taken')

    const project = await this.prisma.project.create({
      data: {
        name,
        slug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: Role.OWNER,
          },
        },
      },
      include: { members: true },
    })

    await this.audit.log({
      userId,
      projectId: project.id,
      action: AuditAction.PROJECT_CREATED,
      resource: `project:${project.id}`,
      metadata: { name, slug },
      ipAddress,
    })
  }

  

  async findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        owner: {
          select: { id: true, email: true, displayName: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, email: true, displayName: true },
            },
          },
        },
        _count: { select: { secrets: true } },
      },
    })
  }

  async findOne(slug: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        owner: {
          select: { id: true, email: true, displayName: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, email: true, displayName: true },
            },
          },
        },
        _count: { select: { secrets: true } },
      },
    })

    if (!project) throw new NotFoundException('Project not found')
    await this.assertMember(project.id, userId)
    return project
  }

  async delete(slug: string, userId: string, ipAddress?: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } })
    if (!project) throw new NotFoundException('Project not found')
    if (project.ownerId !== userId)
      throw new ForbiddenException('Only the owner can delete this project')

    await this.audit.log({
      userId,
      projectId: project.id,
      action: AuditAction.PROJECT_DELETED,
      resource: `project:${project.id}`,
      metadata: { name: project.name, slug },
      ipAddress,
    })


    return this.prisma.project.delete({ where: { slug } })
  }

  async inviteMember(
    slug: string,
    requesterId: string,
    email: string,
    role: Role,
    ipAddress?: string
  ) {
    const project = await this.prisma.project.findUnique({ where: { slug } })
    if (!project) throw new NotFoundException('Project not found')
    await this.assertRole(project.id, requesterId, [Role.OWNER, Role.EDITOR])

    const invitee = await this.prisma.user.findUnique({ where: { email } })
    if (!invitee) throw new NotFoundException('User not found')

    const existing = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId: project.id, userId: invitee.id },
      },
    })
    if (existing) throw new ConflictException('User is already a member')

    const member = await this.prisma.projectMember.create({
      data: { projectId: project.id, userId: invitee.id, role },
      include: {
        user: { select: { id: true, email: true, displayName: true } },
      },
    })

    await this.audit.log({
      userId: requesterId,
      projectId: project.id,
      action: AuditAction.PROJECT_MEMBER_INVITED,
      resource: `project-member:${member.id}`,
      metadata: { userId: invitee.id, role },
      ipAddress,
    })

    return member
  }

  async removeMember(slug: string, requesterId: string, memberId: string, ipAddress?: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } })
    if (!project) throw new NotFoundException('Project not found')
    await this.assertRole(project.id, requesterId, [Role.OWNER])

    await this.audit.log({
      userId: requesterId,
      projectId: project.id,
      action: AuditAction.PROJECT_MEMBER_REMOVED,
      resource: `project-member:${memberId}`,
      metadata: { userId: memberId },
      ipAddress,
    })

    return this.prisma.projectMember.delete({
      where: {
        projectId_userId: { projectId: project.id, userId: memberId },
      },
    })
  }

  async assertMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    })
    if (!member) throw new ForbiddenException('You are not a member of this project')
    return member
  }

  async assertRole(projectId: string, userId: string, roles: Role[]) {
    const member = await this.assertMember(projectId, userId)
    if (!roles.includes(member.role))
      throw new ForbiddenException('You do not have permission for this action')
    return member
  }
}