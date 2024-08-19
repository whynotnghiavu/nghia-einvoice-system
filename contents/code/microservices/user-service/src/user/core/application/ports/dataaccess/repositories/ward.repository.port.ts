import { IRepository } from '@vuvannghia/common';
import { Ward } from '../../../../domain/entities/ward';
import { WardId } from '../../../../domain/value-objects/ward-id';

export abstract class WardRepositoryPort implements IRepository<Ward> {
  abstract save(entity: Ward | Ward[]): Promise<Ward>;
  abstract getAll(): Promise<Ward[]>;
  abstract getOneById(id: WardId): Promise<Ward>;
  abstract delete(entity: Ward): Promise<boolean>;
}
