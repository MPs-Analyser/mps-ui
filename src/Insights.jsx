import { useState } from 'react';

import * as React from 'react'

import "./styles/insights.css";

import { Party } from "./config/constants";

import { config } from './app.config';

import { VOTING_CATEGORIES } from "./config/constants";

import ky from 'ky-universal';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel
} from '@tanstack/react-table'

const types = [
  "MP",
  "Division"
]

const queries = [
  "most",
  "least"
];

const voteTyps = [
  "on",
  "for",
  "against",
];

const columnHelper = createColumnHelper();

const divisionColumns = [
  columnHelper.accessor('title', {
    cell: info => info.getValue(),
    header: () => <span>Name</span>
  }),
  columnHelper.accessor(row => row.count, {
    id: 'count',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Count</span>
  })
]

const mpColumns = [
  columnHelper.accessor('title', {
    cell: info => info.getValue(),
    header: () => <span>Name</span>
  }), columnHelper.accessor('party', {
    cell: info => info.getValue(),
    header: () => <span>Party</span>
  }),
  columnHelper.accessor(row => row.count, {
    id: 'count',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Count</span>
  })
]



const Insights = () => {

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [progress, setProgress] = useState();

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

  const [type, setType] = useState(types[0]);
  const [query, setQuery] = useState(queries[0]);
  const [party, setParty] = useState("Any");
  const [voteType, setVoteType] = useState(voteTyps[0]);
  const [voteCategory, setVoteCategory] = useState(VOTING_CATEGORIES[0]);
  const [limit, setLimit] = useState(10);

  const onSearch = async () => {
    setColumns([]);
    setData([]);
    setProgress(true);

    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&&partyIncludes=${party}`;

    if (voteCategory !== "Any Division") {
      url = url + `&&voteCategory=${voteCategory}`;
    }

    if (type === 'Division' && voteType !== 'on') {
      const ayeOrNo = voteType === "for" ? "aye" : "no";
      url = `${url}&ayeorno=${ayeOrNo}`;
    }

    const result = await ky(url).json();
    console.log('result ', result);

    const formattedResult = [];
    if (type === 'Division') {
      setColumns(divisionColumns);
      result.forEach(i => {
        const row = { title: i._fields[0], count: i._fields[1].low };
        formattedResult.push(row);
      });
    } else {
      setColumns(mpColumns);
      result.forEach(i => {
        const row = { title: i._fields[0], party: i._fields[1], count: i._fields[2].low };
        formattedResult.push(row);
      });
    }
    console.log('formatted result ', formattedResult);

    setData(formattedResult);

    setProgress(false);
  }

  return (

    <div className="insights">

      <div className="wrapper">

        <div className="insights__query">

          <div className="labelwrapper">
            <span className='fixedLabel'>Which</span>

            <select
              className="select insights__select"
              name="type"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              {types.map(type => (
                <option
                  value={type}
                  key={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          {type === 'Division' && (
            
            <div className="labelwrapper">

              <span className='fixedLabel'>type</span>

              <select
                className="select insights__select"
                name="voteCategory"
                onChange={(e) => setVoteCategory(e.target.value)}
                value={voteCategory}
              >
                {VOTING_CATEGORIES.map(value => (
                  <option
                    value={value}
                    key={value}
                  >
                    {value}
                  </option>
                ))}
              </select>

            </div>
          )}

          <div className="labelwrapper">

            {type === 'MP' && (
              <span className='fixedLabel'>from</span>
            )}

            {type === 'MP' && (
              <div>
                <select
                  className="select insights__select"
                  name="party"
                  onChange={(e) => setParty(e.target.value)}
                  value={party}
                >
                  {Object.values(Party).filter(i => i !== "Unknown").map(i => (
                    <option
                      value={i}
                      key={i}
                    >
                      {i}
                    </option>
                  ))}
                </select>

              </div>
            )}
          </div>

          <div className="labelwrapper">
            {type === 'MP' ? <span className='fixedLabel'>voted the</span> : <span className='fixedLabel'>was voted</span>}

            {type === 'Division' && (
              <select
                className="select insights__select"
                name="voteType"
                onChange={(e) => setVoteType(e.target.value)}
                value={voteType}
              >
                {voteTyps.map(i => (
                  <option
                    value={i}
                    key={i}
                  >
                    {i}
                  </option>
                ))}
              </select>
            )}

            {type === 'Division' && <span>the</span>}

            <select
              className="select insights__select"
              name="query"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            >
              {queries.map(query => (
                <option
                  value={query}
                  key={query}
                >
                  {query}
                </option>
              ))}
            </select>
          </div>

          {type === 'MP' && (
            <div className="labelwrapper">

              <span className='fixedLabel'>on</span>

              <select
                className="select insights__select"
                name="voteCategory"
                onChange={(e) => setVoteCategory(e.target.value)}
                value={voteCategory}
              >
                {VOTING_CATEGORIES.map(value => (
                  <option
                    value={value}
                    key={value}
                  >
                    {value}
                  </option>
                ))}
              </select>

            </div>
          )}

          <button
            className='button'
            onClick={onSearch}
          >
            Go
          </button>

        </div>

      </div>

      {progress && (
        <>
          <div className='votingHistoryProgress'>
            <progress value={null} />
            <p>{progress}</p>
          </div>
        </>
      )}

      <div className="insights__result">
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

      <div className="wrapper">
        <div className="insights__config">
          <label>Limit</label>

          <input
            className="input"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
            type="number">
          </input>

          <button
            // style={{ width: '100%' }}
            className='button'
            onClick={onSearch}
          >
            Go
          </button>
        </div>
      </div>

    </div>


  )
}

export default Insights;
