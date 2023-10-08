import { useState } from 'react';

import * as React from 'react'


import "./styles/insights.css";

import { Party } from "./config/constants";

import { config } from './app.config';

import ky from 'ky-universal';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
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

const columns = [
  columnHelper.accessor('title', {
    cell: info => info.getValue(),    
    header: () => <span>Title</span>    
  }),
  columnHelper.accessor(row => row.count, {
    id: 'count',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>    
  })
]


const Insights = () => {

  const [data, setData] = React.useState(() => [])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  const [type, setType] = useState(types[0]);
  const [query, setQuery] = useState(queries[0]);
  const [party, setParty] = useState("Any");
  const [voteType, setVoteType] = useState(voteTyps[0]);
  const [limit, setLimit] = useState(10);

  const onSearch = async () => {
    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&&partyIncludes=${party}`;
    // ?limit=${limit}&orderby=${orderby}&name=${details?.value?.nameDisplayAs}${queryParams}`;

    if (type === 'Division' && voteType !== 'on') {
      const ayeOrNo = voteType === "for" ? "aye" : "no";
      url = `${url}&ayeorno=${ayeOrNo}`;
    }

    const result = await ky(url).json();
    console.log('result ', result);

    const formattedResult = [];
    if (type === 'Division') {
      result.forEach(i => {
        const row = { title: i._fields[0], count: i._fields[1].low};    
        formattedResult.push(row);
      });
    } else {
      result.forEach(i => {
        const row = { title: i._fields[0], count: i._fields[2].low};      
        formattedResult.push(row);
      });
    }
    console.log('formatted result ', formattedResult);

    setData(formattedResult);
  }

  return (

    <div className="insights">

      <div className="wrapper">

        <div className="insights__query">

          <span>which</span>

          <select
            className="select"
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

          {party !== 'Any' ? <span>From the</span> : <span>From</span>}

          {type === 'MP' && (
            <div>
              <select
                className="select"
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

          {type === 'MP' && <span>Party</span>}

          {type === 'MP' ? <span>Voted the</span> : <span>Was voted</span>}

          {type === 'Division' && (
            <select
              className="select"
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
            className="select"
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

          <button
            className='button'
            onClick={onSearch}
          >
            Go
          </button>

        </div>
        <hr />

      </div>

      <div className="insughts__result">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
        <hr />
        <div className="insights__config">
          <label>Result Limit</label>

          <input
            className="input"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            type="number">
          </input>
        </div>
      </div>



    </div>


  )
}

export default Insights;
