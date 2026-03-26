import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Пароль должен быть не короче 8 символов" },
      { status: 400 }
    );
  }

  const nameStr =
    typeof name === "string" && name.trim() ? name.trim() : undefined;

  const existing = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
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
      email: email.trim().toLowerCase(),
      passwordHash,
      name: nameStr,
    },
  });

  return NextResponse.json({ success: true });
}
