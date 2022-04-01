import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
  ) {}

  create(ownerId: string, createCollectionDto: CreateCollectionDto) {
    return this.collectionModel.create({
      ...createCollectionDto,
      owner: ownerId,
    });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.collectionModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        owner: [Op.in],
      },
    });
  }

  findOne(id: string) {
    return this.collectionModel.findByPk(id);
  }

  update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.collectionModel.update(updateCollectionDto, { where: { id } });
  }

  remove(id: string) {
    return this.collectionModel.destroy({ where: { id } });
  }
}
