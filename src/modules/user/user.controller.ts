import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities';
import admin from '../../firebase.config'; // Import Firebase Admin without namespace

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly authorRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    if (!body.name || !body.email || !body.password) {
      throw new HttpException(
        'One of `name, email, password` is missing',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.authorRepository.create(body);
    await this.em.flush();
    return {
      status: 'success',
      data: user,
    };
  }

  @Post('login')
  async login(@Body() body: any) {
    if (!body.email || !body.password) {
      throw new HttpException(
        'One of `email, password` is missing',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.authorRepository.findOne({ email: body.email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== body.password) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const _token = await admin.auth().createCustomToken(JSON.stringify(user));
    const data = {
      token: _token,
      status: 'success',
    };
    return data;
  }

  @Get()
  async home(@Headers() headers: any) {
    // return await this.authorRepository.findAll();
    const _token = headers['authorization'].replace('Bearer ', '');
    const decodedToken = await admin.auth().verifyIdToken(_token);
    if (!decodedToken) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return decodedToken;
  }
}
