import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EncryptionService } from '../encryption/encryption.service'
import { ProjectsService } from '../projects/projects.service'
import { Role } from '../../generated/prisma/browser'
import { AuditAction, AuditService } from 'src/audit/audit.service'

@Injectable()
export class SecretsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
    private projectsService: ProjectsService,
    private audit: AuditService,
  ) {}

  async getSecrets(projectSlug: string, environment: string, userId: string, ipAddress?: string) {
    const project = await this.getProjectOrThrow(projectSlug)
    await this.projectsService.assertMember(project.id, userId)

    const secrets = await this.prisma.secret.findMany({
      where: { projectId: project.id, environment },
      orderBy: { key: 'asc' },
    })

    await this.audit.log({
      userId,
      projectId: project.id,
      action: AuditAction.SECRET_ACCESSED,
      resource: `project:${project.id}:env:${environment}`,
      metadata: { environment, count: secrets.length },
      ipAddress,
    })

    return secrets.map(s => ({
      id: s.id,
      key: s.key,
      value: this.encryption.decrypt(s.value),
      environment: s.environment,
      updatedAt: s.updatedAt,
    }))
  }

 async setSecret(
    projectSlug: string,
    environment: string,
    key: string,
    value: string,
    userId: string,
    ipAddress?: string,
  ) {
    const project = await this.getProjectOrThrow(projectSlug)
    await this.projectsService.assertRole(project.id, userId, [
      Role.OWNER,
      Role.EDITOR,
    ])

    const existing = await this.prisma.secret.findUnique({
      where: {
        projectId_environment_key: { projectId: project.id, environment, key },
      },
    })

    const encryptedValue = this.encryption.encrypt(value)
    const action = existing
      ? AuditAction.SECRET_UPDATED
      : AuditAction.SECRET_CREATED

    const secret = await this.prisma.secret.upsert({
      where: {
        projectId_environment_key: { projectId: project.id, environment, key },
      },
      update: { value: encryptedValue },
      create: { projectId: project.id, environment, key, value: encryptedValue },
      select: { id: true, key: true, environment: true, updatedAt: true },
    })

    await this.audit.log({
      userId,
      projectId: project.id,
      action,
      resource: `project:${project.id}:env:${environment}:key:${key}`,
      metadata: { environment, key },
      ipAddress,
    })

    return secret
  }

  async bulkSetSecrets(
    projectSlug: string,
    environment: string,
    secrets: { key: string; value: string }[],
    userId: string,
    ipAddress?: string
  ) {
    const project = await this.getProjectOrThrow(projectSlug)
    await this.projectsService.assertRole(project.id, userId, [
      Role.OWNER,
      Role.EDITOR,
    ])

    const results = await Promise.all(
      secrets.map(s =>
        this.setSecret(projectSlug, environment, s.key, s.value, userId, ipAddress),
      ),
    )

    await this.audit.log({
      userId,
      projectId: project.id,
      action: AuditAction.SECRET_BULK_SET,
      resource: `project:${project.id}:env:${environment}`,
      metadata: {
        environment,
        keys: secrets.map(s => s.key),
        count: secrets.length,
      },
      ipAddress,
    })

    return { count: results.length, secrets: results }
  }

  async deleteSecret(
    projectSlug: string,
    environment: string,
    key: string,
    userId: string,
      ipAddress?: string
  ) {
    const project = await this.getProjectOrThrow(projectSlug)
    await this.projectsService.assertRole(project.id, userId, [
      Role.OWNER,
      Role.EDITOR,
    ])

    const secret = await this.prisma.secret.findUnique({
      where: {
        projectId_environment_key: {
          projectId: project.id,
          environment,
          key,
        },
      },
    })
    if (!secret) throw new NotFoundException('Secret not found')

    await this.prisma.secret.delete({ where: { id: secret.id } })

    await this.audit.log({
        userId,
        projectId: project.id,
        action: AuditAction.SECRET_DELETED,
        resource: `project:${project.id}:env:${environment}:key:${key}`,
        metadata: { environment, key },
        ipAddress,
      })

    return { message: 'Secret deleted' }
  }

  async getEnvironments(projectSlug: string, userId: string) {
    const project = await this.getProjectOrThrow(projectSlug)
    await this.projectsService.assertMember(project.id, userId)

    const result = await this.prisma.secret.groupBy({
      by: ['environment'],
      where: { projectId: project.id },
    })

    const defaults = ['development', 'staging', 'production']
    const existing = result.map(r => r.environment)
    const all = [...new Set([...defaults, ...existing])]
    return all.map(env => ({
      name: env,
      count: existing.includes(env)
        ? result.find(r => r.environment === env)
        : 0,
    }))
  }

  private async getProjectOrThrow(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } })
    if (!project) throw new NotFoundException('Project not found')
    return project
  }
}