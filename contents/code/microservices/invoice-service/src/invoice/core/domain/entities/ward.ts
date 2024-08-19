import { DistrictId } from '../value-objects/district-id';
import { WardId } from '../value-objects/ward-id';

export class Ward {
  wardId: WardId;
  name: string;
  districtId: DistrictId;

  constructor(wardId: WardId) {
    this.wardId = wardId;
  }
}
