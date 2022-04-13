import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Paginate, PaginateQuery } from 'src/common/paginate/decorator';
import { User } from 'src/common/user.decorator';
import { UpsertProjectDto } from './dto/upsert-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
const MIME_TYPES = ['image/png', 'image/jpeg'];

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'preview', maxCount: 1 },
        { name: 'north', maxCount: 1 },
        { name: 'east', maxCount: 1 },
        { name: 'south', maxCount: 1 },
        { name: 'west', maxCount: 1 },
      ],
      {
        limits: { fileSize: 10000000 },
        fileFilter: (_, file, cb) => {
          if (MIME_TYPES.length > 0) {
            cb(null, MIME_TYPES.includes(file.mimetype));
          } else {
            cb(null, true);
          }
        },
      },
    ),
  )
  async upload(
    @UploadedFiles() files: Map<string, Express.Multer.File[]>,
    @User('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.projectsService.fileUpload(files, userId, id);
  }
}
