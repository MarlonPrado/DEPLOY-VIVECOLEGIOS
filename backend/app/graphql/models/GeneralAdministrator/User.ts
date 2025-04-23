import { Field, ID, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, Index, ManyToOne, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

import { Lazy } from '../../../types';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { DocumentType } from './DocumentType';
import { Gender } from './Gender';
import { Role } from './Role';
import { School } from './School';

@Index("index_full", ["username", "genderId", "documentTypeId", "roleId"])
@ObjectType({ description: 'The User model' })
@Entity()
export class User {
  @Field(() => ID)
  @ObjectIdColumn()
  id!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  active?: boolean;

  @Field({ nullable: true })
  @Column({ type: 'number', default: 0 })
  version!: number;

  @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  createdByUserId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedByUserId?: string;

  @Field(() => User, { nullable: true })
  createdByUser?: User;

  @Field(() => User, { nullable: true })
  updatedByUser?: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  //@Index("index_username", { unique: true })
  @Index("index_username")
  @Field({ nullable: true })
  @Column({ nullable: true })
  username?: string;

  @ManyToOne(() => Gender, (data) => data.id, { lazy: true })
  @Field((_type) => Gender, { nullable: true })
  gender?: Gender;

  @Index("index_genderId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  genderId?: string;

  @ManyToOne(() => DocumentType, (data) => data.id, { lazy: true })
  @Field((_type) => DocumentType, { nullable: true })
  documentType?: DocumentType;

  @Index("index_documentTypeId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  documentTypeId?: string;

  //@Index("index_documentNumber", { unique: true })
  @Index("index_documentNumber")
  @Field({ nullable: true })
  @Column({ nullable: true })
  documentNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  birthdate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePhoto?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  signaturePhoto?: string;

  @ManyToOne(() => Role, (data) => data.id, { lazy: true })
  @Field(() => Role, { nullable: true })
  role?: Lazy<Role>;

  @Index("index_roleId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  roleId?: string;

  @Index("index_schoolId")
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  schoolId?: string;

  @Field(() => School, { nullable: true })
  school?: School;
}

@ObjectType()
export class UserEdge extends EdgeType('User', User) { }

@ObjectType()
export class UserConnection extends ConnectionType<UserEdge>('User', UserEdge) { }
