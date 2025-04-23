import { Field, InputType } from 'type-graphql';

import { SyncOffline } from '../../models/SchoolAdministrator/SyncOffline';
import { NewSyncOfflineDescription } from './NewSyncOfflineDescription';

@InputType()
export class NewSyncOffline implements Partial<SyncOffline> {
  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  academicPeriodId?: string;

  @Field((type) => [NewSyncOfflineDescription], { nullable: true })
  syncOfflineDescriptions?: NewSyncOfflineDescription[];

  @Field({ nullable: true })
  finish?: boolean;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}
