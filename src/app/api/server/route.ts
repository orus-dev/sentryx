import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { servers } from "../servers/route";
import { validate } from "../auth/route";

/*
  Vision: This will be 
*/
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!validate(searchParams.get("sessionId")))
    return NextResponse.json(
      { message: "Invalid session" },
      { status: HttpStatusCode.Unauthorized }
    );

  const index = searchParams.get("index");

  if (!index)
    return NextResponse.json(
      {
        message: "The index is invalid",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  return NextResponse.json({
    message: "ok",
  });
}
