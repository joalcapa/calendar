export default class BaseService {
  error: { message: string } | null;
  valid: boolean;

  constructor() {
    this.error = null;
    this.valid = true;
  }

  setError(message: string) {
    this.error = { message };
    this.valid = false;
  }

  isValid(): boolean {
    return this.valid;
  }

  getError(): { message: string } | null {
    return this.error;
  }
}