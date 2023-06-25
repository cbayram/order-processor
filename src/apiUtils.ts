type SuccessResponse<T> = {
  status: "ok";
  data: T;
};
type ErrorResponse = {
  status: "error";
  errmsg: string;
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T = unknown>(data: T): SuccessResponse<T> {
  return {
    status: "ok",
    data,
  };
}

export function errorResponse(errmsg: string): ErrorResponse {
  return {
    status: "error",
    errmsg,
  };
}

export function isErrorResponse(
  response: Response<unknown>
): response is ErrorResponse {
  return response.status == "error";
}
