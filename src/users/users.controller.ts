import { Controller, Get, Post, Body, Res, HttpStatus, HttpException, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.schema';
import { UsersDto } from './users.dto';
import { FetchUsersDto } from './fetchusers.dto';
import { Response,Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('create')
  async create(@Body() createUserDto: UsersDto, @Res() res: Response): Promise<void> {
    try {
      const user = await this.usersService.create(createUserDto);
      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }

  @Post('login')
  async login(@Body() fetchUsersDto: FetchUsersDto, @Res({passthrough:true}) res: Response): Promise<any> {
    try {
      const user = await this.usersService.validateUser(fetchUsersDto);
      res.cookie("jwt",user,{httpOnly:true})
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }


  @Get('user')
  async user(@Req() req:Request,@Res() res:Response){
    //try{
      const cookies=req.cookies['jwt']
      const userVerification= await this.jwtService.verifyAsync(cookies)
      if(!userVerification){
        throw new UnauthorizedException
      }else{
        const users = await this.usersService.findOne(userVerification.id);
          const {password,...userdata}=users
    // console.log("users-------",userdata)
    // return userdata;
       
        res.status(HttpStatus.OK).json(userdata);
      } 
    // }catch(e){
    //     throw new UnauthorizedException();
    // }




  }

  // @Get()
  // async findAll(@Res() res: Response): Promise<void> {
  //   try {
  //     const users = await this.usersService.findAll();
  //     res.status(HttpStatus.OK).json(users);
  //   } catch (error) {
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  //   }
  // }
}
