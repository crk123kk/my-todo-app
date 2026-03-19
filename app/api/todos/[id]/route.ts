import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeader } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getTokenFromHeader(req.headers.get("authorization"));
  if (!payload) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const todoId = parseInt(id);

  const todo = await prisma.todo.findUnique({ where: { id: todoId } });
  if (!todo || todo.userId !== payload.userId) {
    return NextResponse.json({ error: "找不到该任务" }, { status: 404 });
  }

  const updated = await prisma.todo.update({
    where: { id: todoId },
    data: { done: !todo.done },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getTokenFromHeader(req.headers.get("authorization"));
  if (!payload) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const todoId = parseInt(id);

  const todo = await prisma.todo.findUnique({ where: { id: todoId } });
  if (!todo || todo.userId !== payload.userId) {
    return NextResponse.json({ error: "找不到该任务" }, { status: 404 });
  }

  await prisma.todo.delete({ where: { id: todoId } });
  return NextResponse.json({ success: true });
}
