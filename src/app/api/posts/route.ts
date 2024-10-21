// File: app/api/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import ServerApiClient from "../../../utils/serverApiClient";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("_page") || "1", 10);

  const apiClient = new ServerApiClient(
    request,
    "https://jsonplaceholder.typicode.com"
  );

  try {
    return await apiClient.get<unknown>(`/posts?_page=${page}`);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}
