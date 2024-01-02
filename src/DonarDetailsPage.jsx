import { useState } from "react";

// import ky from 'ky-universal';
// import { config } from './app.config';

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel
} from '@tanstack/react-table'

const columnHelper = createColumnHelper();

const DonarDetailsPage = ({ donarHeader, donarDetails }) => {

	const [sorting, setSorting] = useState([]);

	// useEffect(() => {
	// 	console.log(donarHeader);
	// }, [donarDetails]);

	const columns = [
		columnHelper.accessor('donationType', {
			cell: info => info.getValue(),
			header: <span style={{ marginRight: 0 }}>Type</span>
		}),
		columnHelper.accessor("amount", {
			cell: info =>
				new Intl.NumberFormat('en-GB', {
					style: 'currency',
					currency: 'GBP'
				}).format(info.getValue())
			,
			header: <span style={{ marginRight: 0 }}>Amount</span>
		}),
		columnHelper.accessor('receivedDate', {
			cell: info => info.getValue().year.low,
			header: <span style={{ marginRight: 0 }}>Date</span>
		}),
		columnHelper.accessor('partyName', {
			cell: info => info.getValue(),
			header: <span style={{ marginRight: 0 }}>Donation to</span>
		})
	]



	const table = useReactTable({
		data: donarDetails,
		columns,
		state: {
			sorting
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
	})

	return (
		<div className="donarDetailsPage" style={{ marginTop: 60 }}>

			<ul>
				<li>{donarHeader.donar}</li>
				<li>{donarHeader.accountingUnitName}</li>
				<li>{donarHeader.postcode}</li>
				<li>{donarHeader.donorStatus}</li>
			</ul>

			<h4 style={{ marginTop: 8, marginBottom: 0 }}>Totals</h4>
			<ul>
				{donarHeader.totals && Object.keys(donarHeader.totals).map(i => (<li key={i}>{i}: {donarHeader.totals[i]}</li>))}
			</ul>


			{JSON.stringify()}


			<table>
				<thead>
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										:
										(
											<div
												{...{
													className: header.column.getCanSort()
														? 'cursor-pointer select-none votingHistory__table__header'
														: 'votingHistory__table__header',
													onClick: header.column.getToggleSortingHandler(),
												}}
												style={{ whiteSpace: 'nowrap' }}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{{
													asc: <svg className='votingHistory__table__sort' width='16' height='16' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 21l12-18 12 18z" /></svg>,
													desc: <svg className='votingHistory__table__sort' width='16' height='16' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 3l-12 18-12-18z" /></svg>,
												}[header.column.getIsSorted()] ?? null}
											</div>
										)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map(row => (
						// JSON.stringify(row)
						<tr key={row.id}>
							{row.getVisibleCells().map(cell => (
								<td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>


	);
};

export default DonarDetailsPage;
