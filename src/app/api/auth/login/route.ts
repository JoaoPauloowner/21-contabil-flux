import { NextResponse } from "next/server";
import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { users, organizationMembers, organizations } from "@/server/infrastructure/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { setSessionCookie } from "@/server/application/session";

export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    // Busca associação de organização
    const [membership] = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, user.id));

    const [org] = membership
      ? await db.select().from(organizations).where(eq(organizations.id, membership.organizationId))
      : [null];

    const sessionData = {
      userId: user.id,
      userName: user.name,
      email: user.email,
      organizationId: org?.id ?? "org_principal",
      organizationName: org?.name ?? "21 Contábil & Associados",
      role: membership?.role ?? ("owner" as const),
    };

    await setSessionCookie(sessionData);

    return NextResponse.json({ success: true, user: sessionData });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno no login" }, { status: 500 });
  }
}
