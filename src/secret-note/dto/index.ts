import { IsString, IsInt } from 'class-validator';

export class CreateSecretNoteDto {
  @IsString()
  note: string;
}

export class UpdateSecretNoteDto {
  @IsString()
  note: string;
}

export class IdDto {
  @IsInt()
  id: number;
}
