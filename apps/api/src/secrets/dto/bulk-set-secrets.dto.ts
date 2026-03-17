import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { SetSecretDto } from './set-secret.dto'

export class BulkSetSecretsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetSecretDto)
  secrets: SetSecretDto[]
}