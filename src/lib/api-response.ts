import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

export function successResponse<T>(data: T, meta?: ApiResponse<T>["meta"], status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      meta,
    },
    { status }
  );
}

export function errorResponse(error: string, details?: unknown, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      error,
      details,
    },
    { status }
  );
}

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
