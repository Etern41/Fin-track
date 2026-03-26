export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/transactions",
    "/transactions/:path*",
    "/analytics",
    "/analytics/:path*",
  ],
};
