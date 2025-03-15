import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemCommon } from './common.entity';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { PaginationService } from '@ffsm/nest-paginate';

@Module({
  imports: [TypeOrmModule.forFeature([SystemCommon])],
  controllers: [CommonController],
  providers: [CommonService, PaginationService],
})
export class CommonModule {}
