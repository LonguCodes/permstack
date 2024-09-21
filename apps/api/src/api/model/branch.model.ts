import { Property, Required } from '@tsed/schema';

export class BranchModel {
  @Required()
  branch: string;
}
