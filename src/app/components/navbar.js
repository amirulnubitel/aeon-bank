import Link from "next/link";
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
	return (
		<Popover className="relative bg-white">
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
						<div className="flex items-center md:ml-12">
							<Link href="/sign-in" className="text-base font-medium text-gray-500 hover:text-gray-900">
								Sign In
							</Link>
						</div>
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
					<div className="px-5 py-6 bg-dark-700">
						<p className="text-center text-base font-medium text-gray-500">
							<Link href="/sign-in" className="text-[#ef24b8]">
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</PopoverPanel>
		</Popover>
	);
}
