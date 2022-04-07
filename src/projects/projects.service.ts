import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginateQuery } from 'src/common/paginate/decorator';
import { paginate } from 'src/common/paginate/paginate';
import { StorageService } from 'src/storage/storage.service';
import { ListProjectResponseDto } from './dto/list-project-response.dto';
import { UpsertProjectDto } from './dto/upsert-project.dto';
import { Project } from './entities/project.entity';
import * as mime from 'mime-types';

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
  'is_public',
];

export const THUMBNAIL_FILE_NAME = 'thumbnail';
const FILE_NAMES = [
  THUMBNAIL_FILE_NAME,
  'preview',
  'north',
  'east',
  'south',
  'west',
];
const MIME_TYPES = ['image/png', 'image/jpeg'];

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
    private readonly storageService: StorageService,
  ) {}

  findAll(owner, query: PaginateQuery): Promise<ListProjectResponseDto> {
    const where: { owner?: string } = {};
    if (query.filter && !query.filter.is_public) {
      where.owner = owner;
    }

    return paginate(query, this.projectModel, {
      maxLimit: 100,
      defaultLimit: 30,
      sortableColumns: ['id'],
      searchableColumns: [],
      defaultSortBy: [['id', 'DESC']],
      where,
      attributes: ATTRIBUTES,
      filterableColumns: {
        id: [],
        owner: [],
        is_public: [],
      },
    });
  }

  async findOne(owner: string, id: string): Promise<Project> {
    const project = await this.projectModel.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`project ${id} not found`);
    if (!project.is_public && project.owner != owner)
      throw new UnauthorizedException(`cannot view project ${id}`);
    return project;
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

  async remove(owner: string, id: string) {
    const deletedCount = await this.projectModel.destroy({
      where: { id, owner },
    });
    if (deletedCount > 0) {
      await this.storageService.delete(`projects/${id}`);
    }
    return deletedCount;
  }

  async fileUpload(@Req() req, @Res() res, id: string, owner: string) {
    const project = await this.projectModel.findOne({
      where: { id, owner },
      attributes: ['id', 'thumbnail'],
    });
    if (!project) throw new NotFoundException(`project ${id} not found`);

    const uploader = this.storageService.getFileUploader(
      { mimeTypes: MIME_TYPES },
      (req: Request, file: Express.Multer.File): string => {
        const extension = mime.extension(file.mimetype);
        const filename = `${file.fieldname}.${extension}`;
        return `projects/${id}/${filename}`;
      },
    );

    const uploadFileFields = FILE_NAMES.map((fieldName) => ({
      name: fieldName,
      maxCount: 1,
    }));
    const handler = uploader.fields(uploadFileFields);
    await handler(req, res, async (error) => {
      if (error) {
        throw new BadRequestException(error);
      }
      const reqFiles = req.files as Record<string, Express.Multer.File[]>;
      const files = Object.values(reqFiles).map((files) => files[0]);
      const thumbnail = files.find(
        (file) => file.fieldname === THUMBNAIL_FILE_NAME,
      );
      if (thumbnail) {
        const extension = mime.extension(thumbnail.mimetype);
        await this.projectModel.update(
          { thumbnail: `${THUMBNAIL_FILE_NAME}.${extension}` },
          { where: { id }, returning: false },
        );
      }
    });
  }
}
