import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USER_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    !("password" in body)
  ) {
    return NextResponse.json(
      { error: "Укажите email и пароль" },
      { status: 400 }
    );
  }

  const { email, password, name } = body as {
    email: unknown;
    password: unknown;
    name?: unknown;
  };

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }

  const emailTrimmed = email.trim();
  if (emailTrimmed.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json({ error: "Email слишком длинный" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов` },
      { status: 400 }
    );
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: "Пароль слишком длинный" },
      { status: 400 }
    );
  }

  let nameStr: string | undefined;
  if (typeof name === "string" && name.trim()) {
    const n = name.trim();
    if (n.length > MAX_USER_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Имя не длиннее ${MAX_USER_NAME_LENGTH} символов` },
        { status: 400 }
      );
    }
    nameStr = n;
  }

  const existing = await prisma.user.findUnique({
    where: { email: emailTrimmed.toLowerCase() },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Пользователь с таким email уже зарегистрирован" },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      email: emailTrimmed.toLowerCase(),
      passwordHash,
      name: nameStr,
    },
  });

  return NextResponse.json({ success: true });
}
