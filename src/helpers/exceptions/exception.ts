export type ExceptionStatusCode = number;

export interface CreateExceptionOptions {
  /**
   * HTTP status code.
   */
  statusCode?: ExceptionStatusCode;
  /**
   * 3 digits code for identifying the error.
   */
  messageCode?: string;
  /**
   * Additional details.
   */
  details?: unknown;
}

export class Exception extends Error {
  /**
   * HTTP status code.
   */
  public readonly statusCode?: ExceptionStatusCode;

  /**
   * 3 digits code for identifying the error.
   */
  public readonly messageCode?: string;

  /**
   * Additional details.
   */
  public readonly details?: unknown;

  constructor(message: string, options?: CreateExceptionOptions) {
    super(message);
    this.details = options?.details;
    this.statusCode = options?.statusCode;
    this.messageCode = options?.messageCode ?? options?.statusCode?.toString();
  }
}
