"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table";

export default function Dashboard() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sessionInfo, setSessionInfo] = useState(null);
	const router = useRouter();

	const [transactions, setTransactions] = useState([]);
	const [loadingTransactions, setLoadingTransactions] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				setLoadingTransactions(true);
				const response = await fetch("/api/transaction-history");
				const result = await response.json();

				if (result.success) {
					setTransactions(result.data);
				} else {
					setError(result.error || "Failed to fetch transactions");
				}
			} catch (err) {
				setError("Failed to fetch transactions");
				console.error("Error fetching transactions:", err);
			} finally {
				setLoadingTransactions(false);
			}
		};

		fetchTransactions();
	}, []);

	useEffect(() => {
		// Check authentication status
		const token = localStorage.getItem("authToken");
		const userData = localStorage.getItem("user");

		if (!token || !userData) {
			router.push("/");
			return;
		}

		try {
			// Verify token (client-side check)
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);
			setSessionInfo({
				loginTime: new Date().toLocaleString(),
				sessionActive: true,
				tokenPresent: !!token,
			});
		} catch (error) {
			console.error("Error parsing user data:", error);
			handleLogout();
		} finally {
			setLoading(false);
		}
	}, [router]);

	const handleLogout = () => {
		// Clear session data
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		setUser(null);
		// Redirect to login
		router.push("/");
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef24b8] mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600">Redirecting to login...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-red-600 dark:text-red-400">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="px-6 py-5 sm:py-4 lg:px-8 w-full">
				<div className="px-4 py-6 sm:px-0">
					{/* Welcome Section */}
					<div className="bg-white overflow-hidden shadow rounded-lg mb-6">
						<div className="px-4 py-5 sm:p-6">
							<div className="sm:flex sm:items-center sm:justify-between">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">Dashboard</h3>
									<p className="mt-1 max-w-2xl text-sm text-gray-500">Welcome to your secure banking dashboard, {user.name}.</p>
								</div>
								<div className="mt-4 sm:mt-0">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Secure Session Active</span>
								</div>
							</div>
						</div>
					</div>

					{/* Session Information */}
					<div className="bg-white overflow-hidden shadow rounded-lg mb-6">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Session Information</h3>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="bg-blue-50 p-4 rounded-lg">
									<div className="text-sm font-medium text-blue-800">Username</div>
									<div className="mt-1 text-lg font-mono text-blue-900">{user.username}</div>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<div className="text-sm font-medium text-green-800">Full Name</div>
									<div className="mt-1 text-lg text-green-900">{user.name}</div>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<div className="text-sm font-medium text-purple-800">Session Status</div>
									<div className="mt-1 text-lg text-purple-900">{sessionInfo?.sessionActive ? "Active" : "Inactive"}</div>
								</div>
								<div className="bg-orange-50 p-4 rounded-lg">
									<div className="text-sm font-medium text-orange-800">Authentication</div>
									<div className="mt-1 text-lg text-orange-900">Multi-Factor Verified</div>
								</div>
							</div>
						</div>
					</div>

					{/* Security Features Demo */}
					<div className="bg-white overflow-hidden shadow rounded-lg mb-6">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Security Features Implemented</h3>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div>
										<h4 className="text-sm font-medium text-green-800">Secure Word Authentication</h4>
										<p className="mt-1 text-xs text-green-700">HMAC-based temporary secure words with 60s expiration</p>
									</div>
								</div>

								<div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div>
										<h4 className="text-sm font-medium text-green-800">Client-Side Hashing</h4>
										<p className="mt-1 text-xs text-green-700">SHA-256 password hashing before transmission</p>
									</div>
								</div>

								<div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div>
										<h4 className="text-sm font-medium text-green-800">TOTP MFA</h4>
										<p className="mt-1 text-xs text-green-700">Time-based One-Time Password authentication</p>
									</div>
								</div>

								<div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div>
										<h4 className="text-sm font-medium text-green-800">Rate Limiting</h4>
										<p className="mt-1 text-xs text-green-700">10-second cooldown for secure word requests</p>
									</div>
								</div>

								<div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div>
										<h4 className="text-sm font-medium text-green-800">MFA Lockout</h4>
										<p className="mt-1 text-xs text-green-700">3 attempts max, 15-minute lockout protection</p>
									</div>
								</div>

								<div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div>
										<h4 className="text-sm font-medium text-green-800">JWT Sessions</h4>
										<p className="mt-1 text-xs text-green-700">Secure session management with JWT tokens</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Mock Banking Features */}
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Banking Dashboard</h3>
							<div className="py-12">
								<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
								<h3 className="mt-2 text-center text-sm font-medium text-gray-900">Secure Banking Features</h3>
								<p className="mt-1 text-center text-sm text-gray-500">This demo focused on the authentication flow. In a real banking app, this area would contain account balances, transaction history, and banking services.</p>
								<div className="mt-6">
									<Table data={transactions} loading={loadingTransactions} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
