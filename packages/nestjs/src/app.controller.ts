import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { GetCategoryUseCase } from '@fc/micro-videos/category/application';
console.log(GetCategoryUseCase.UseCase);

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
