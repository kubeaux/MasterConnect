import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pages publiques (pas de protection)
  const publicPaths = ["/", "/login", "/register"];
  if (publicPaths.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Vérifier le token côté serveur (cookie ou header)
  // Note : en mode JWT localStorage, le middleware ne peut pas vérifier.
  // La protection se fait côté client dans les layouts.
  // Ce middleware est un filet de sécurité basique.

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};