import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { RoleModule } from "./role/role.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule, UserModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
