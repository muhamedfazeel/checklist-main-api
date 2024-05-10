import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { CustomLogger } from 'src/custom-logger/custom-logger.service';
import { UtilsService } from 'src/utils/utils.service';
import { LoginDto, UserData } from './dto/auth.dto';
import { DatabaseService } from 'src/database/database.service';
import { LoginQuery, SetImageUrlQuery } from './auth.repo';

@Injectable()
export class AuthService {
  constructor(
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
    private readonly logger: CustomLogger,
    private readonly utilsService: UtilsService,
    private readonly db: DatabaseService<any>,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async login(body: LoginDto): Promise<any> {
    const { token } = body;
    const client = new OAuth2Client();
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: this.config.google.clientId,
      });
      const payload = ticket.getPayload() as TokenPayload;
      const { email, picture } = payload;
      const [user] = await this.db.rawQuery(
        LoginQuery,
        [email],
        UserData,
        true,
      );

      if (!user) {
        throw new NotFoundException('User not found! Contact admin for access');
      } else {
        if (!user?.imageUrl) {
          await this.db.rawQuery(
            SetImageUrlQuery,
            [picture, user.id],
            UserData,
            false,
          );
          user.imageUrl = picture;
        }

        return { data: user };
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
