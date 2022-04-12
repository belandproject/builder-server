import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './entities/project.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { StorageModule } from 'src/storage/storage.module';
import { OptionalAuthenticationMiddleware } from 'src/common/middlewares/optional-authentication.middleware';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [SequelizeModule.forFeature([Project]), StorageModule],
})
export class ProjectsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      {
        path: '/v1/projects/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/v1/projects/:id',
        method: RequestMethod.POST,
      },
      {
        path: '/v1/projects/:id',
        method: RequestMethod.DELETE,
      },
      {
        path: '/v1/projects/:id/upload',
        method: RequestMethod.POST,
      },
    );

    consumer.apply(OptionalAuthenticationMiddleware).forRoutes(
      {
        path: '/v1/projects/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/v1/projects',
        method: RequestMethod.GET,
      },
    );
  }
}
