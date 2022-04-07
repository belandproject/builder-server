import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './entities/project.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { StorageService } from 'src/storage/storage.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, StorageService],
  imports: [SequelizeModule.forFeature([Project])],
})
export class ProjectsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({
        path: '/v1/projects',
        method: RequestMethod.OPTIONS,
      })
      .forRoutes('/v1/projects/(.*)', '/v1/projects');
  }
}
