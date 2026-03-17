import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export enum AuditAction {
  // Auth
  USER_REGISTER = 'USER_REGISTER',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',

  // Projects
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  PROJECT_MEMBER_INVITED = 'PROJECT_MEMBER_INVITED',
  PROJECT_MEMBER_REMOVED = 'PROJECT_MEMBER_REMOVED',

  // Secrets
  SECRET_ACCESSED = 'SECRET_ACCESSED',
  SECRET_CREATED = 'SECRET_CREATED',
  SECRET_UPDATED = 'SECRET_UPDATED',
  SECRET_DELETED = 'SECRET_DELETED',
  SECRET_BULK_SET = 'SECRET_BULK_SET',
}

export interface LogEventParams {
  userId?: string
  projectId?: string
  action: AuditAction
  resource: string
  metadata?: Record<string, any>
  ipAddress?: string
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: LogEventParams) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        projectId: params.projectId ?? null,
        action: params.action,
        resource: params.resource,
        metadata: params.metadata ?? {},
        ipAddress: params.ipAddress ?? null,
      },
    })
  }

  async getLogsForUser(userId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  async getLogsForProject(projectId: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, email: true, displayName: true },
        },
      },
    })
  }
}