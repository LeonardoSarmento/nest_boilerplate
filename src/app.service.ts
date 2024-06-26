import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  /**
   * @author @leosarmento-findes
   * @todo Criar pagina com dois links: Swagger e Documentação estática
   *  (Compodoc).
   */
  getHello(): string {
    return "Hello World!";
  }
}
