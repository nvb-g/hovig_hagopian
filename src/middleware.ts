import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get("user-agent") || "";

    if (userAgent === "node" || userAgent === "") {
        return new NextResponse(null, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
