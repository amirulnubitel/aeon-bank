"use client";

import Login from "@/components/login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check authentication status
		const token = localStorage.getItem("authToken");
		const userData = localStorage.getItem("user");

		if (token || userData) {
			router.push("/dashboard");
			return;
		}

		try {
			// Verify token (client-side check)
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);
		} catch (error) {
			console.error("Error parsing user data:", error);
		} finally {
			setLoading(false);
		}
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef24b8] mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="px-6 py-5 sm:py-4 lg:px-8 w-full">
				<Login />
			</main>
		</div>
	);
}
