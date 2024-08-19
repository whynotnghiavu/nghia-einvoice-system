import { CityId } from '../value-objects/city-id';

export class City {
  cityId: CityId;
  name: string;

  constructor(cityId: CityId) {
    this.cityId = cityId;
  }
}
