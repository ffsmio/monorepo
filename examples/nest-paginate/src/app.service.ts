import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemCommon } from './common/common.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '@ffsm/nest-paginate';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(SystemCommon)
    private readonly commonRepo: Repository<SystemCommon>,
    private readonly paginateService: PaginationService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  getCommons() {}
}
