import { IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class SetSecretDto {
  @IsString()
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Key must be uppercase letters, numbers and underscores only',
  })
  key: string

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  value: string
}