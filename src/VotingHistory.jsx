import * as React from 'react'

import './styles/votingHistory.css';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper();

function VotingHistory({ votingHistory, onQueryDivision }) {

  React.useEffect(() => {
    setData(votingHistory)
  }, [votingHistory]);

  const [data, setData] = React.useState(() => [[]])
  const [sorting, setSorting] = React.useState([])
  // const [division, setDivision] = React.useState()

  const columns = [

    columnHelper.accessor('title', {
      cell: info => <button className='button-link'
        onClick={async () => {          
          const id = info.row.original.divisionId;
          console.log(`Get details for  ${id}`);
          onQueryDivision(id);
        }}>
        {info.getValue()}
      </button>,
      footer: info =>
        info.column.id,
      header: 'Vote Title'
    }),
    columnHelper.accessor('date', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
      header: 'Date'
    }),
    columnHelper.accessor('memberVotedAye', {
      cell: info => JSON.stringify(info.getValue()),
      footer: info => info.column.id,
      header: 'Voted for'
    })
  ]


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  })

  return (
    <div className="votingHistory">

      <div className='votingHistory__table'>
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
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
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
      
    </div>
  )
}

export default VotingHistory;