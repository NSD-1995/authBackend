import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(Users.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: Users): Promise<Users> {
    const userAvailable = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (userAvailable) {
      this.logger.error('A user already exists with this email');
      throw new BadRequestException('A user already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      name: createUserDto.name,
      password: hashedPassword,
      email: createUserDto.email,
    });
    this.logger.log('User created successfully');
    return createdUser.save();
  }

  async validateUser(fetchUsersDto: any): Promise<any> {
    const user = await this.userModel
      .findOne({ email: fetchUsersDto.email })
      .exec();
    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(
      fetchUsersDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      this.logger.error('Invalid password');
      throw new UnauthorizedException('Invalid password');
    }
    const jwt = await this.jwtService.signAsync({
      id: user._id,
      email: user.email,
    });
    this.logger.log('Token created successfully');
    return jwt;
  }

  async findOne(id: string): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.error('User not found');
      throw new BadRequestException('User not found');
    }
    const { password, ...userdata } = user.toObject();
    this.logger.log('User data');
    return userdata;
  }
}
