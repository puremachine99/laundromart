import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { RestartSessionDto } from './dto/restart-session.dto';
import { StartSessionDto } from './dto/start-session.dto';
import { StopSessionDto } from './dto/stop-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  startSession(@Body() payload: StartSessionDto) {
    return this.sessionsService.startSession(payload);
  }

  @Post('restart')
  @HttpCode(HttpStatus.ACCEPTED)
  restartSession(@Body() payload: RestartSessionDto) {
    return this.sessionsService.restartSession(payload);
  }

  @Post('stop')
  @HttpCode(HttpStatus.ACCEPTED)
  stopSession(@Body() payload: StopSessionDto) {
    return this.sessionsService.stopSession(payload);
  }
}
