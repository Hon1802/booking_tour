export class BadRequestError extends Error {
    status: number;
  
    constructor(message: string) {
      super(message);
      this.name = "BadRequestError";
      this.status = 400; // Gán mã trạng thái HTTP 400
    }
  }