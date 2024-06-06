import { NotFoundException, BadRequestException } from '@nestjs/common';

export class SecretNoteNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Secret note with ID ${id} not found`);
  }
}

export class InvalidSecretNoteException extends BadRequestException {
  constructor() {
    super('Note content cannot be empty');
  }
}
