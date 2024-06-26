import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  console.time("Restart");
  const APP_PORT = process.env.APP_PORT || "3333";
  const NODE_ENV = process.env.NODE_ENV || "development";

  const app = await NestFactory.create(AppModule, {
    logger:
      NODE_ENV != "production"
        ? ["debug", "error", "warn"]
        : ["debug", "error", "fatal", "log", "verbose", "warn"],
  });
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Nest Project Boilerplate (backend)")
    .setDescription("The API description")
    // .setVersion('0.0.1')

    .addBearerAuth()
    .addCookieAuth("jwt")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  /// `<HOST>/swagger` -> Swagger UI Doc
  /// `<HOST>/swagger-json` -> Swagger data (.json)

  SwaggerModule.setup("swagger", app, document, {
    /**
     * @author @cdonat-ist
     * Setting Swagger UI dark mode for development environment.
     * @see {@link https://stackoverflow.com/a/75492773/16245809}
     */
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
    ],
  });

  app.use(cookieParser());
  await app.listen(APP_PORT, () => console.timeEnd("Restart"));
}
bootstrap();
