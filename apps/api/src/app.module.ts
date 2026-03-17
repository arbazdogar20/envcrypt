import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { EncryptionModule } from './encryption/encryption.module'
import { ProjectsModule } from './projects/projects.module'
import { SecretsModule } from './secrets/secrets.module'
import { AuditService } from './audit/audit.service';
import { AuditController } from './audit/audit.controller';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EncryptionModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    SecretsModule,
    AuditModule,
  ],
  providers: [AuditService],
  controllers: [AuditController],
})
export class AppModule {}