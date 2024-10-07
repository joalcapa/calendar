/**
 * A base service class that provides error handling functionality.
 */
export default class BaseService {
  /** The error message, if any. */
  error: string;

  /** Indicates whether the service is valid. */
  valid: boolean;

  /**
   * Initializes a new instance of the BaseService class.
   * Sets the initial error message to an empty string and valid status to true.
   */
  constructor() {
    this.error = '';
    this.valid = true;
  }

  /**
   * Sets the error message and marks the service as invalid.
   *
   * @param message - The error message to set.
   */
  setError(message: string) {
    this.error = message;
    this.valid = false;
  }

  /**
   * Checks if the service is valid.
   *
   * @returns A boolean indicating whether the service is valid.
   */
  isValid(): boolean {
    return this.valid;
  }

  /**
   * Gets the current error message.
   *
   * @returns The error message as a string.
   */
  getError(): string {
    return this.error;
  }
}
