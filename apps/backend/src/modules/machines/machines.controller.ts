import { Controller, Get } from '@nestjs/common';
import { MachinesService } from './machines.service';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async list() {
    return this.machinesService.listMachines();
  }
}
