import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  create(createProjectDto: CreateProjectDto, owner): Promise<Project> {
    return this.projectModel.create({
      ...createProjectDto,
      owner,
    });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.projectModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        owner: [],
      },
    });
  }

  findOne(id: string): Promise<Project> {
    return this.projectModel.findByPk(id);
  }

  update(owner: string, id: string, updateProjectDto: UpdateProjectDto) {
    return this.projectModel.update(updateProjectDto, { where: { id, owner } });
  }

  remove(owner: string, id: string) {
    return this.projectModel.destroy({ where: { id, owner } });
  }
}
