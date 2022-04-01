import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './entities/project.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [SequelizeModule.forFeature([Project])],
})
export class ProjectsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: 'projects', method: RequestMethod.GET })
      .forRoutes(ProjectsController);
  }
}
