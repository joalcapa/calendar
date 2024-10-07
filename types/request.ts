/**
 * Represents the allowed HTTP methods for a request.
 */
type allowedMethod = 'get' | 'post' | 'put' | 'delete';

/**
 * Represents an HTTP request.
 */
export interface Request {
  /** The URI of the request. */
  uri: string;

  /** The HTTP method for the request, which must be one of the allowed methods: 'get', 'post', 'put', or 'delete'. */
  method: allowedMethod;
}
