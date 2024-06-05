import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SecretNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  note: string;

  @Column({ default: '' })
  ephemeralPublicKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
