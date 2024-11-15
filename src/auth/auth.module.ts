import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserSchema ,User} from 'src/schemas/user.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: User.name, schema: UserSchema }
    ])
],
  controllers: [AuthController],
  providers:[AuthService]
})
export class AuthModule {}
