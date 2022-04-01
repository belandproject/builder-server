import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { ProjectGuard } from './project.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery, @Request() req) {
    query.filter.owner = req.user.id;
    return this.projectsService.findAll(query);
  }

  @UseGuards(ProjectGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return req.project;
  }

  @UseGuards(ProjectGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @UseGuards(ProjectGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
