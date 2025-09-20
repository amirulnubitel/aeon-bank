import { NextResponse } from "next/server";

export function middleware(request) {
	// Get the pathname
	const { pathname } = request.nextUrl;

	// Check if accessing dashboard
	if (pathname.startsWith("/dashboard")) {
		// In a real app, you'd verify the JWT token from cookies
		// For this demo, the client-side authentication is sufficient
		// as it's just a demonstration
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
