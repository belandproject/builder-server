import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @User('id') userId) {
    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery, @Request() req) {
    query.filter.owner = req.user.id;
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return req.project;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @User('id') userId,
  ) {
    return this.projectsService.update(userId, id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.projectsService.remove(userId, id);
  }
}
