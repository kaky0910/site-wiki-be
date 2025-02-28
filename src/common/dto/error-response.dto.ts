export class ErrorResponseDto {
  success: boolean;
  message: string;
  error: any;

  constructor(message: string = 'Operation failed', error: any = null) {
    this.success = false;
    this.message = message;
    this.error = error;
  }
}