import { NextResponse } from "next/server";
import {
  authenticateWithCredentials,
  authenticateWithPasskey,
  createSessionToken,
  AUTH_COOKIE_NAME,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authType, email, password, passkey } = body || {};

    let user = null;

    if (authType === "passkey") {
      if (!passkey || typeof passkey !== "string") {
        return NextResponse.json(
          { error: "Please enter a valid Mission Passkey or Access Token." },
          { status: 400 }
        );
      }
      user = authenticateWithPasskey(passkey);
    } else {
      // Default: email & password credentials
      if (!email || !password) {
        return NextResponse.json(
          { error: "Please provide both researcher email and password." },
          { status: 400 }
        );
      }
      user = authenticateWithCredentials(email, password);
    }

    // Access check: block random visitors / hackers
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Access Denied: Unrecognized scientific credentials. Only authorized researchers and mission partners may enter the observatory.",
        },
        { status: 401 }
      );
    }

    // Generate signed token
    const token = await createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      message: `Access clearance verified. Welcome, ${user.name}.`,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Auth login failure:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authorization. Please retry." },
      { status: 500 }
    );
  }
}
