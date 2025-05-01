import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';

/**
 * Admin model for GraphQL
 */
@ObjectType()
export class Admin {
  /**
   * Unique admin ID
   */
  @Field(() => ID)
  id: string;

  /**
   * Admin email address
   */
  @Field()
  email: string;

  /**
   * Hashed password
   */
  @Field()
  passwordHash: string;

  /**
   * Last login timestamp
   */
  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date | null;

  /**
   * When the admin account was created
   */
  @Field()
  createdAt: Date;
}

@InputType()
export class UpdateAdminInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  passwordHash?: string;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;
}
