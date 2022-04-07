import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { UpsertProjectDto } from './dto/upsert-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery, @User('id') userId) {
    return this.projectsService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') userId) {
    return this.projectsService.findOne(userId, id);
  }

  @Post(':id')
  upsert(
    @Param('id') id: string,
    @Body() data: UpsertProjectDto,
    @User('id') userId,
  ) {
    return this.projectsService.upsert(userId, id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId) {
    return this.projectsService.remove(userId, id);
  }

  @Post(':id/upload')
  async upload(
    @Req() req,
    @Res() res,
    @User('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.projectsService.fileUpload(req, res, id, userId);
  }
}
