// @ts-nocheck
import * as React from 'react'

import './votingHistory.css';

import ky from 'ky-universal';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<Person>()


function VotingHistory({ votingHistory, onQueryMp }) {

  React.useEffect(() => {
    setData(votingHistory)
  }, [votingHistory]);

  const [data, setData] = React.useState(() => [[]])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [division, setDivision] = React.useState<SortingState>()

  const columns = [

    columnHelper.accessor('title', {
      cell: info => <button className='button-link'
        onClick={async () => {
          const id = info.row.original.divisionId.low;
          console.log(`Get details for  ${id}`);
          const response = await ky(`https://commonsvotes-api.parliament.uk/data/division/${id}.json`).json();
          console.log('division ', response);
          setDivision(response);

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
                        }[header.column.getIsSorted() as string] ?? null}
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

      {division && (
        <div className="votingHistory__division">
          <h3>Divison Details</h3>


          <ul>
            <li>{division.Title}</li>
            <li>{division.Date}</li>
            <li>AyeCount: {division.AyeCount}</li>
            <li>NoCount: {division.NoCount}</li>
          </ul>

          <section>
            <h4>Members who voted Aye</h4>
            <ul>
              <li>
                <button 
                  className='button-link'
                  onClick={async () => onQueryMp(division.Ayes[0]?.MemberId)}>
                  {division.Ayes[0]?.Name}
                </button>
              </li>
              <li>
                <button className='button-link'
                  onClick={async () => {
                    const response = await ky(`https://members-api.parliament.uk/api/Members/${division.Ayes[1]?.MemberId}`).json();
                    console.log('response ', response);
                  }}>
                  {division.Ayes[1]?.Name}
                </button>
              </li>
              <li>.....</li>
            </ul>

            <h4>Members who voted No</h4>
            <ul>
              <li>
                <button className='button-link'
                  onClick={async () => {
                    const response = await ky(`https://members-api.parliament.uk/api/Members/${division.Noes[0]?.MemberId}`).json();
                    console.log('response ', response);
                  }}>
                  {division.Noes[0]?.Name}
                </button>
              </li>
              <li>
                <button className='button-link'
                  onClick={async () => {
                    const response = await ky(`https://members-api.parliament.uk/api/Members/${division.Noes[1]?.MemberId}`).json();
                    console.log('response ', response);
                  }}>
                  {division.Noes[1]?.Name}
                </button>
              </li>
              <li>.....</li>
            </ul>
          </section>

        </div>
      )}


    </div>
  )
}

export default VotingHistory;