import { Module } from '@nestjs/common'
import { SecretsService } from './secrets.service'
import { SecretsController } from './secrets.controller'
import { EncryptionModule } from '../encryption/encryption.module'
import { ProjectsModule } from '../projects/projects.module'
import { AuditModule } from 'src/audit/audit.module'

@Module({
  imports: [EncryptionModule, ProjectsModule, AuditModule],
  providers: [SecretsService],
  controllers: [SecretsController],
  exports: [SecretsService],
})
export class SecretsModule {}