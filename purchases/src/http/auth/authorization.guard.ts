import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'node:util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUT0_AUDIENCE: string;
  private AUT0_DOMAIN: string;

  constructor(private configService: ConfigService) {
    this.AUT0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') ?? '';
    this.AUT0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req, res } = GqlExecutionContext.create(context).getContext();

    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUT0_DOMAIN}.well-known/jwks.json`,
        }),
        audience: this.AUT0_AUDIENCE,
        issuer: this.AUT0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJwt(req, res);
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
