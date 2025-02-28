export class SuccessResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  failData: T;

  constructor(data: T, failData: any = null, message: string = 'Operation successful') {
    this.success = true;
    this.message = message;
    this.data = data;
    this.failData = failData;
  }
}