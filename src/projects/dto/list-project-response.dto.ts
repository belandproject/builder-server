import { Project } from '../entities/project.entity';

export class ListProjectResponseDto {
  rows: Project[];
  count: number;
}
