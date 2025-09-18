export default function SignIn() {
	return (
		<>
			<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form action="#" method="POST" className="space-y-6">
						<div>
							<label htmlFor="username" className="block text-base font-medium text-gray-900 ">
								Username
							</label>
							<div className="mt-2">
								<input id="username" name="username" type="text" required autoComplete="username" className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2" />
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-base font-medium text-gray-900 ">
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-sm bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-sm bg-[#ef24b8] px-3 py-2 font-semibold text-white  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
							>
								Sign In
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
