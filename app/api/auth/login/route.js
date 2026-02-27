import { NextResponse } from "next/server";

export async function POST(req) {
  const { passcode } = await req.json();
  const adminPasscode = process.env.ADMIN_PASSCODE;

  if (!adminPasscode) {
    return NextResponse.json(
      { success: false, error: "Admin passcode not configured." },
      { status: 500 }
    );
  }

  if (!passcode || passcode !== adminPasscode) {
    return NextResponse.json(
      { success: false, error: "Invalid passcode." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("blueline_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return res;
}
