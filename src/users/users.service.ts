import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: Users): Promise<Users> {
    const userAvailable = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (userAvailable) {
      throw new BadRequestException('A user already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      name: createUserDto.name,
      password: hashedPassword,
      email: createUserDto.email,
    });
    return createdUser.save();
  }

  async validateUser(fetchUsersDto: any): Promise<any> {
    const user = await this.userModel
      .findOne({ email: fetchUsersDto.email })
      .exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(
      fetchUsersDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid password');
    }
    const jwt = await this.jwtService.signAsync({
      id: user._id,
      email: user.email,
    });
    return jwt;
  }

  async findOne(id:string): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    const {password,...userdata}=user.toObject()
    console.log(userdata)
    return userdata;
  }
}
