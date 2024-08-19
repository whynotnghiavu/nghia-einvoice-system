import { DistrictId } from '../value-objects/district-id';
import { CityId } from './../value-objects/city-id';

export class District {
  districtId: DistrictId;
  name: string;
  CityId: CityId;

  constructor(districtId: DistrictId) {
    this.districtId = districtId;
  }
}
