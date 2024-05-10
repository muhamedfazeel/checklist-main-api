import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CustomValidationPipe } from 'src/pipes/custom-validation.pipe';
import { LoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new CustomValidationPipe())
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ status: HttpStatus.OK })
  async login(@Body() body: LoginDto): Promise<any> {
    return this.authService.login(body);
  }
}
