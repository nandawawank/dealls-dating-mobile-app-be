export type ResponseJson<T, R, P> = {
  code: number;
  message: string;
  data?: T;
  error?: R;
  pagination?: P;
};
