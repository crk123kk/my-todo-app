import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = getTokenFromHeader(req.headers.get("authorization"));
  if (!payload) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const payload = getTokenFromHeader(req.headers.get("authorization"));
  if (!payload) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: {
      content: content.trim(),
      userId: payload.userId,
    },
  });

  return NextResponse.json(todo, { status: 201 });
}
