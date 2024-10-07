type allowedMethod = 'get' | 'post' | 'put' | 'delete';

export interface Request {
  uri: string;
  method: allowedMethod;
}