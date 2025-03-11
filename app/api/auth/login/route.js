import { NextResponse } from "next/server";

const USERS_DB = [{ email: "user@example.com", password: "password123" }];

export async function POST(req) {
  const { email, password } = await req.json();

  const user = USERS_DB.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const fakeToken = "fake-jwt-token"; // Replace this with real JWT generation

  return NextResponse.json({ token: fakeToken }, { status: 200 });
}
