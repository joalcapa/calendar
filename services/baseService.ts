export default class BaseService {
  error: string;
  valid: boolean;

  constructor() {
    this.error = '';
    this.valid = true;
  }

  setError(message: string) {
    this.error = message;
    this.valid = false;
  }

  isValid(): boolean {
    return this.valid;
  }

  getError(): string {
    return this.error;
  }
}