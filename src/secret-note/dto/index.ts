import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSecretNoteDto {

  @ApiProperty({
    example: 'simple note',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  note: string;
}

export class UpdateSecretNoteDto {
  @ApiProperty({
    example: 'simple updated note',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  note: string;
}

export class IdDto {
  @ApiProperty({
    example: 1,
    required: true
  })
  @IsInt()
  id: number;
}