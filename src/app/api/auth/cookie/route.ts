import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { value } = body;

    const response = NextResponse.json({ success: true });
    response.cookies.set("baas_auth", value, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("baas_auth", "", {
    httpOnly: false,
    path: "/",
    maxAge: 0,
  });

  return response;
}
