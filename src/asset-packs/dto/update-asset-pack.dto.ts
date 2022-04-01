import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetPackDto } from './create-asset-pack.dto';

export class UpdateAssetPackDto extends PartialType(CreateAssetPackDto) {}
