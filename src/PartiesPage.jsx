import { useEffect, useState } from 'react';

import "./styles/partiesPage.css";

import { config } from './app.config';
import ky from 'ky-universal';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel
} from '@tanstack/react-table'

const columnHelper = createColumnHelper();

const Parties = () => {

  const [parties, setParties] = useState([]);
  const [donations, setDonations] = useState();
  const [sorting, setSorting] = useState([]);

  const columns = [
    columnHelper.accessor('partyName', {
      cell: info => <i>{info.getValue()}</i>,
      header: <span style={{ marginRight: 0 }}>Party</span>
    }),
    columnHelper.accessor("memberCount", {
      cell: info => <i>{info.getValue()}</i>,
      header: <span style={{ marginRight: 0 }}>Member Count</span>
    }),
    columnHelper.accessor('donationCount', {
      cell: info => <i>{info.getValue()}</i>,
      header: <span style={{ marginRight: 0 }}>Donation Count</span>
    }),
    columnHelper.accessor('totalDonationValue', {
      cell: info => <i>{info.getValue()}</i>,
      header: <span style={{ marginRight: 0 }}>Donation value</span>
    }),
  ]

  const table = useReactTable({
    data: donations,
    columns,
    state: {
      sorting
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  })



  useEffect(() => {

    const getParties = async () => {

      const mpsResponse = await ky(`${config.mpsApiUrl}getparties`).json();
      setParties(mpsResponse);

      const donationsResponse = await ky(`${config.mpsApiUrl}donations`).json();
      setDonations(donationsResponse);
    }

    getParties();

  }, []);

  return (
    <div className="partiesPage">

      <div className="partiesPage__header">
        <h3>Total donations since 01-Jan-2000</h3>
      </div>


      {parties && donations && (
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

export default Parties;
