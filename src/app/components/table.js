export default function Table({ data: dataTable = [], loading }) {
	if (loading) {
		return (
			<div className="w-full flex items-center justify-center py-10">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
			</div>
		);
	}
	return (
		<div className="w-full">
			<div className="ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
				<table className="relative min-w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-white">
								Date
							</th>
							<th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell dark:text-white">
								Reference ID
							</th>
							<th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell dark:text-white">
								To
							</th>
							<th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell dark:text-white">
								Transaction Type
							</th>
							<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{dataTable.map((data) => (
							<tr key={data.id}>
								<td className={"relative py-4 pr-3 pl-4 text-sm sm:pl-6"}>{data.date}</td>
								<td className={"border-t border-gray-200 dark:border-white/10 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell dark:text-gray-400"}>{data.reference_id}</td>
								<td className={"border-t border-gray-200 dark:border-white/10 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell dark:text-gray-400"}>{data.to}</td>
								<td className={"border-t border-gray-200 dark:border-white/10 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell dark:text-gray-400"}>{data.transaction_type}</td>
								<td className={"border-t border-gray-200 dark:border-white/10 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell dark:text-gray-400"}>{data.amount}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
