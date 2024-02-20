import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dtos/success-response.dto';

@ApiTags('Health')
@Controller('status')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Get server status' })
  @ApiOkResponse({ type: SuccessResponseDto })
  statusCheck(): SuccessResponseDto {
    return;
  }
}
