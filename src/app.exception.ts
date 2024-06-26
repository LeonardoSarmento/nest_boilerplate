export class AppException extends Error {
  public errors: string[];
  public statusCode: number; // extends StatusCode;

  constructor(
    /* message: string, */
    statusCode: number,
    errors: string[],
  ) {
    super();
    // super.message = message;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}
