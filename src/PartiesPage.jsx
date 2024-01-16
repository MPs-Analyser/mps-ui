import { useEffect, useState } from 'react';

import "./styles/partiesPage.css";

import MultiDonationsTable from "./MultiDonationsTable";

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

const Parties = ({ onQueryPartyDonars, onSearchDonarNames }) => {

  const [donations, setDonations] = useState();
  const [multiDonations, setMultiDonations] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [tableType, setTableType] = useState("party");
  const [donar, setDonar] = useState();

  const columns = [
    columnHelper.accessor('partyName', {
      cell: info => <span onClick={() => onQueryPartyDonars(info.row.original.partyName)} style={{ textWrap: 'nowrap' }}>{info.getValue()}</span>,
      header: <span style={{ marginRight: 0 }}>Party</span>
    }),
    columnHelper.accessor("memberCount", {
      cell: info => <i onClick={() => onQueryPartyDonars(info.row.original.partyName)} style={{ textWrap: 'nowrap' }}>{info.getValue()}</i>,
      header: <span style={{ marginRight: 0 }}>Member Count</span>
    }),
    columnHelper.accessor('donationCount', {
      cell: info => <i onClick={() => onQueryPartyDonars(info.row.original.partyName)} style={{ textWrap: 'nowrap' }}>{info.getValue()}</i>,
      header: <span style={{ marginRight: 0 }}>Donation Count</span>
    }),
    columnHelper.accessor('totalDonationValue', {
      cell: info => <i onClick={() => onQueryPartyDonars(info.row.original.partyName)} style={{ textWrap: 'nowrap' }}>{new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(info.getValue())}</i>,
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

  const onQueryMultiPartyDonars = async () => {
    setTableType('multi');
    const response = await ky(`${config.mpsApiUrl}donations?multiparty=true`).json();
    // setPartyDonations(donationsResponse);		
    console.log(response);
    setMultiDonations(response);
  }


  const getParties = async () => {
    setTableType("party");
    const donationsResponse = await ky(`${config.mpsApiUrl}donations`).json();
    setDonations(donationsResponse);
  }


  useEffect(() => {

    const getPartiesLocal = async () => {

      const donationsResponse = await ky(`${config.mpsApiUrl}donations`).json();
      setDonations(donationsResponse);
    }

    getPartiesLocal();

  }, []);

  return (
    <div className="partiesPage">

      <div className="partiesPage__header" style={{}}>
        <button onClick={tableType === "party" ? onQueryMultiPartyDonars : getParties}>{tableType === "party" ? "Multi Party Donars" : "Donations"}</button>

        <div className="donarSearchWraper">
          <label htmlFor="donarSearch">Search donar:</label>
          <input
            type="search"
            title="name"
            placeholder="Search Donar"
            className='input'
            value={donar}
            onChange={(e) => setDonar(e.target.value)}
          />
          <button
            className='button'
            onClick={() => onSearchDonarNames(donar)}
          >
            Go
          </button>
        </div>

        {tableType === "party" ? <h3>Total donations since 01-Jan-2000</h3> : <h3>Multi donations since 01-Jan-2000</h3>}
      </div>

      {tableType === "multi" && (
        <MultiDonationsTable multiDonations={multiDonations} />
      )}

      {tableType === "party" && donations && (
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
