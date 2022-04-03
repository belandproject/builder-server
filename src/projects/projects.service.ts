import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { UpsertProjectDto } from './dto/upsert-project.dto';
import { Project } from './entities/project.entity';

const ATTRIBUTES = [
  'id',
  'name',
  'description',
  'thumbnail',
  'owner',
  'created_at',
  'updated_at',
  'cols',
  'rows',
  'is_published',
];

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  findAll(owner, query: PaginateQuery) {
    return paginate(query, this.projectModel, {
      maxLimit: 100,
      defaultLimit: 30,
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      where: { owner },
      attributes: ATTRIBUTES,
      filterableColumns: {
        id: [],
        owner: [],
      },
    });
  }

  findOne(id: string): Promise<Project> {
    return this.projectModel.findByPk(id);
  }

  async upsert(owner: string, id: string, upsertData: UpsertProjectDto) {
    const project = await this.projectModel.findByPk(id, {
      attributes: ATTRIBUTES,
    });
    if (!project) {
      return this.projectModel.create({
        ...upsertData,
        owner,
        id,
      });
    }
    if (project.owner != owner) {
      throw new UnauthorizedException('cannot edit asset pack');
    }

    project.setAttributes(upsertData);
    return project.save();
  }

  remove(owner: string, id: string) {
    return this.projectModel.destroy({ where: { id, owner } });
  }
}
