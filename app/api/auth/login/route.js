import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function loadLocalPasscode() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const contents = fs.readFileSync(envPath, "utf8");
    const match = contents.match(/^ADMIN_PASSCODE=(.*)$/m);
    if (!match) return undefined;
    return match[1].trim();
  } catch {
    return undefined;
  }
}

export async function POST(req) {
  const { passcode } = await req.json();
  const adminPasscode = process.env.ADMIN_PASSCODE || loadLocalPasscode();

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
