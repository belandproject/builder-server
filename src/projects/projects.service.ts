import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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

  create(
    createProjectDto: CreateProjectDto,
    auth: { id: string },
  ): Promise<Project> {
    return this.projectModel.create({
      ...createProjectDto,
      owner: auth.id,
    });
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.projectModel, {
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        id: [],
        owner: [Op.in],
      },
    });
  }

  findOne(id: string): Promise<Project> {
    return this.projectModel.findByPk(id);
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectModel.update(updateProjectDto, { where: { id } });
  }

  remove(id: number) {
    return this.projectModel.destroy({ where: { id } });
  }
}
