"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const menu = [
	{
		name: "Showcase",
		href: "/",
	},
	{
		name: "Docs",
		href: "/",
	},
	{
		name: "Blogs",
		href: "/",
	},
	{
		name: "Analytics",
		href: "/",
	},
	{
		name: "Commerce",
		href: "/",
	},
	{
		name: "Templates",
		href: "/",
	},
	{
		name: "Enterprise",
		href: "/",
	},
];

export default function Navbar() {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Check authentication status on component mount
		const checkAuth = () => {
			const token = localStorage.getItem("authToken");
			const userData = localStorage.getItem("user");

			if (token && userData) {
				try {
					const parsedUser = JSON.parse(userData);
					setUser(parsedUser);
					setIsAuthenticated(true);
				} catch (error) {
					console.error("Error parsing user data:", error);
					handleLogout();
				}
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
		};

		checkAuth();

		// Listen for storage changes (e.g., login/logout from another tab)
		const handleStorageChange = (e) => {
			if (e.key === "authToken" || e.key === "user") {
				checkAuth();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		setIsAuthenticated(false);
		setUser(null);
		router.push("/");
	};

	const renderAuthButtons = () => {
		if (isAuthenticated && user) {
			return (
				<div className="flex items-center space-x-4">
					<span className="text-sm text-gray-600">Welcome, {user.name}</span>
					<button onClick={handleLogout} className="text-base cursor-pointer font-medium text-gray-500 hover:text-gray-900">
						Logout
					</button>
				</div>
			);
		}

		return (
			<div class="relative flex items-center w-full max-w-md mx-auto">
				<input type="text" placeholder="Search..." class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 " />
				<button class="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-blue-500 ">
					<MagnifyingGlassIcon aria-hidden="true" className="size-5" />
				</button>
			</div>
		);
	};

	const renderMobileAuthButtons = () => {
		if (isAuthenticated && user) {
			return (
				<div className="px-5 py-6">
					<div className="space-y-4">
						<p className="text-center text-sm text-gray-600">Welcome, {user.name}</p>
						<button onClick={handleLogout} className="block cursor-pointer w-full text-center text-base font-medium text-[#ef24b8] hover:text-[#d91ea3]">
							Logout
						</button>
					</div>
				</div>
			);
		}
	};

	return (
		<Popover className="fixed w-full bg-white">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 shadow-sm" />
			<div className="relative z-20">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:py-4 md:justify-start md:space-x-10 lg:px-8">
					<div>
						<Link href="/" className="flex">
							<span className="sr-only">Aeon Bank</span>
							<img alt="logo" src="/web-app-manifest-192x192.png" className="h-8 w-auto rounded-sm sm:h-10" />
						</Link>
					</div>
					<div className="-my-2 -mr-2 md:hidden">
						<PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500  focus:outline-hidden focus:ring-inset">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open menu</span>
							<Bars3Icon aria-hidden="true" className="size-6" />
						</PopoverButton>
					</div>
					<div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
						<PopoverGroup as="nav" className="flex space-x-6">
							{menu.map((item) => (
								<Link key={item.name} href={item.href} className="text-base font-medium text-gray-500 hover:text-gray-900">
									{item.name}
								</Link>
							))}
						</PopoverGroup>
						<div className="flex items-center md:ml-12">{renderAuthButtons()}</div>
					</div>
				</div>
			</div>

			<PopoverPanel transition className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-100 data-leave:ease-in md:hidden">
				<div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
					<div className="px-5 pt-5 pb-6 sm:pb-8">
						<div className="flex items-center justify-between">
							<div>
								<img alt="logo" src="/web-app-manifest-192x192.png" className="h-8 w-auto rounded-sm sm:h-10" />
							</div>
							<div className="-mr-2">
								<PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500  focus:outline-hidden focus:ring-inset space-x-3">
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Close menu</span>
									<MagnifyingGlassIcon aria-hidden="true" className="size-6" />
									<XMarkIcon aria-hidden="true" className="size-6" />
								</PopoverButton>
							</div>
						</div>
						<div className="mt-6 sm:mt-8">
							<nav>
								<div className="grid gap-7 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8">
									{menu.map((item) => (
										<Link key={item.name} href={item.href} className="text-base font-medium text-gray-500 hover:text-gray-900">
											{item.name}
										</Link>
									))}
								</div>
							</nav>
						</div>
					</div>
					{renderMobileAuthButtons()}
				</div>
			</PopoverPanel>
		</Popover>
	);
}
