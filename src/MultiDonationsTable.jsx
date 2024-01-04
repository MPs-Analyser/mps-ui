import { useState } from 'react';

import "./styles/partiesPage.css";

// import { config } from './app.config';
// import ky from 'ky-universal';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel
} from '@tanstack/react-table'

const columnHelper = createColumnHelper();

const MultiDonationsTable = ({ onQueryPartyDonars, multiDonations }) => {
  
  const [sorting, setSorting] = useState([]);
  
  const columns = [
    columnHelper.accessor('donor', {
      cell: info => <span onClick={() => onQueryPartyDonars(info.row.original.partyName)} style={{ textWrap: 'nowrap' }}>{info.getValue()}</span>,
      header: <span style={{ marginRight: 0 }}>Donar</span>
    }),
    columnHelper.accessor("numberOfPartiesDonated", {
      cell: info => <i onClick={() => onQueryPartyDonars(info.row.original.partyName)} style={{ textWrap: 'nowrap' }}>{info.getValue()}</i>,
      header: <span style={{ marginRight: 0 }}>Party Count</span>
    }),
    columnHelper.accessor('partyNames', {
      cell: info => <i onClick={() => onQueryPartyDonars(info.row.original.partyName)} style={{ textWrap: 'nowrap' }}>{info.getValue().join(", ")}</i>,
      header: <span style={{ marginRight: 0 }}>Parties</span>
    })
  ]

  const table = useReactTable({
    data: multiDonations,
    columns,
    state: {
      sorting
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  })


  return (
    <div className="multiDonationsTable">

      {multiDonations && (
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
      )}

    </div>
  )
}

export default MultiDonationsTable;
