import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
    imports:[
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'ashdbfsjjfbdfbdcjbsdbcfdhbfcdhfhedcfhbcbhdbcbdchbasdhbcdbchdakcjldcfaakfbldjbhsabvfchavbdhajchbdshchdcbhdsjacshdfvbhewfdjcdsjcv',
          signOptions: { expiresIn: '1h' },
        }), 
    ],
    exports: [PassportModule, JwtModule],
})
export class AuthModule {}
