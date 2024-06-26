import { useState } from 'react';

import * as React from 'react'

import "./styles/insights.css";

import { Party } from "./config/constants";

import { config } from './app.config';

import { VOTING_CATEGORIES, EARLIEST_FROM_DATE } from "./config/constants";

import ky from 'ky-universal';

// import useStore from './store';

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

const Insights = ({ onQueryDivision, onQueryMp }) => {

  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [progress, setProgress] = useState();
  const [fromDate, setFromDate] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substr(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));

  const divisionColumns = [
    columnHelper.accessor('title', {
      cell: info => info.getValue() ? (
        <span onClick={() => onQueryDivision(info.row.original.id)} style={{ textWrap: 'nowrap' }}>
          <svg
            className="votingHistory__table-svg"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.052 19.001l.051.002.051.003.05.004.051.006.05.007.049.008.049.01.049.01.048.012.048.013.047.014.046.015.047.016.045.018.045.018.045.02.044.02.043.022.043.022.043.024.041.025.041.025.04.027.04.027.039.028.038.03.037.03.037.031.036.032.035.032.034.034.034.034.032.035.032.036.031.037.03.037.03.038.028.039.027.04.027.04.025.041.025.041.024.043.022.042.022.044.02.044.02.045.018.045.018.045.016.047.015.046.014.047.013.048.012.048.01.049.01.049.008.049.007.05.006.051.004.05.003.051.002.051.001.052v1h1v2h-13v-2h1v-1l.001-.052.002-.051.003-.051.004-.05.006-.051.007-.05.008-.049.01-.049.01-.049.012-.048.013-.048.014-.047.015-.046.016-.047.018-.045.018-.045.02-.045.02-.044.022-.044.022-.042.024-.043.025-.041.025-.041.027-.04.027-.04.028-.039.03-.038.03-.037.031-.037.032-.036.032-.035.034-.034.034-.034.035-.032.036-.032.037-.031.037-.03.038-.03.039-.028.04-.027.04-.027.041-.025.041-.025.043-.024.043-.022.043-.022.044-.02.045-.02.045-.018.045-.018.047-.016.046-.015.047-.014.048-.013.048-.012.049-.01.049-.01.049-.008.05-.007.051-.006.05-.004.051-.003.051-.002.052-.001h7l.052.001zm-7.039 1.999h-.013v1h7v-1h-6.987zm9.356-20.999l.05.001.05.003.049.005.049.005.049.007.049.007.048.009.048.011.048.011.047.012.047.014.046.014.046.016.046.017.045.018.045.019.044.021.044.021.043.022.043.024.042.025.041.025.041.027.041.028.039.029.039.029.039.031.038.032.037.033.036.034.036.035 4.949 4.949.035.036.034.036.033.038.032.037.031.039.03.039.029.04.027.04.027.042.026.041.024.042.024.043.022.043.022.044.02.044.019.045.018.045.017.046.016.046.015.046.013.047.012.047.012.048.01.048.009.048.007.049.007.048.005.049.005.05.003.049.001.05.001.05-.001.061-.003.061-.004.06-.006.06-.008.059-.01.058-.011.058-.013.057-.015.056-.016.056-.018.055-.019.054-.02.053-.023.053-.023.051-.025.051-.027.05-.027.05-.029.048-.031.047-.031.046-.033.046-.034.044-.036.044-.036.042-.038.041-.038.041-.04.039-.041.038-.041.037-.043.035-.044.035-.044.033-.046.032-.046.031-.047.029-.049.029-.048.027-.05.025-.05.024-.051.023-.052.021-.052.02-.053.019-.054.017-.054.016-.054.014-.056.012-.055.011-.056.009-.057.008-.057.006-.057.005-.057.003-.058.001-.058-.001-.059-.002-.058-.004-.059-.006-.059-.008-.059-.009-.059-.012-.06-.013-.059-.015-1.219 1.22 2.099 1.947 1.696 1.57 1.33 1.229 1.003.924.714.656.463.424.249.227.075.068.05.051.049.052.047.053.045.054.045.055.042.056.041.056.04.057.038.058.037.059.035.059.034.06.032.061.031.061.028.062.028.063.026.063.024.064.023.064.02.065.02.065.018.066.016.066.014.067.013.067.011.067.009.068.008.067.006.069.005.068.002.069.001.069-.001.073-.003.072-.005.072-.006.071-.009.071-.011.07-.012.07-.014.069-.016.069-.017.068-.02.068-.021.066-.022.067-.025.065-.026.065-.027.064-.029.063-.031.062-.032.061-.034.061-.035.06-.036.059-.038.057-.04.057-.041.056-.042.055-.043.054-.045.052-.046.052-.047.05-.049.05-.05.048-.05.047-.052.045-.054.045-.054.043-.055.042-.057.04-.057.039-.058.038-.06.036-.06.035-.061.034-.063.031-.063.031-.063.028-.065.028-.066.025-.066.024-.067.023-.068.02-.068.019-.069.017-.07.016-.071.013-.071.012-.071.01-.073.008-.072.006-.074.005-.073.002h-.074l-.075-.001-.075-.004-.063-.005-.062-.006-.062-.007-.062-.009-.062-.011-.061-.012-.061-.013-.061-.015-.06-.017-.06-.018-.06-.019-.059-.021-.059-.022-.059-.024-.058-.025-.058-.026-.057-.028-.057-.03-.056-.031-.056-.032-.056-.033-.055-.035-.054-.037-.054-.037-.054-.039-.053-.041-.052-.042-.052-.043-.051-.044-.051-.046-.05-.047-.049-.049-.042-.044-.075-.082-.241-.269-.349-.392-.437-.495-1.071-1.216-1.213-1.38-1.213-1.381-1.068-1.218-1.133-1.292-1.313 1.312.015.061.013.061.011.061.009.06.007.061.006.06.003.059.002.06.001.059-.002.059-.003.058-.005.058-.006.058-.009.057-.009.056-.012.056-.012.056-.015.055-.016.054-.017.054-.019.053-.02.052-.022.052-.023.051-.025.05-.026.049-.027.049-.028.048-.03.046-.031.047-.032.045-.034.044-.035.043-.035.042-.037.042-.039.04-.039.039-.04.038-.041.037-.043.036-.043.035-.045.033-.045.033-.046.031-.047.029-.048.029-.049.027-.05.026-.051.024-.051.023-.053.022-.053.02-.053.019-.055.017-.055.016-.056.014-.056.013-.057.011-.058.009-.058.008-.059.006-.059.004-.06.003-.06.001-.05-.001-.05-.002-.05-.003-.05-.004-.049-.005-.049-.007-.048-.008-.049-.009-.048-.01-.047-.011-.047-.013-.047-.014-.047-.014-.046-.016-.045-.017-.045-.018-.045-.019-.044-.021-.044-.021-.043-.022-.043-.024-.042-.025-.041-.025-.041-.027-.041-.028-.039-.029-.04-.029-.038-.031-.038-.032-.037-.033-.036-.034-.036-.035-4.949-4.948-.004-.004-.035-.036-.033-.036-.033-.038-.032-.038-.031-.038-.029-.039-.029-.04-.028-.041-.026-.041-.026-.041-.024-.042-.023-.043-.023-.043-.021-.043-.02-.045-.019-.044-.018-.045-.017-.046-.015-.045-.015-.047-.013-.046-.013-.047-.011-.048-.01-.047-.009-.048-.008-.049-.006-.048-.005-.049-.005-.049-.003-.05-.001-.049-.001-.05.001-.05.001-.049.003-.05.004-.049.006-.049.006-.049.008-.048.009-.048.01-.048.011-.047.012-.047.014-.047.014-.047.016-.046.017-.045.018-.045.019-.045.02-.044.021-.044.023-.043.023-.043.025-.042.025-.042.027-.041.028-.04.029-.04.029-.04.031-.038.032-.038.033-.038.034-.036.035-.036.051-.049.052-.047.054-.045.054-.042.055-.041.056-.038.058-.036.058-.034.058-.032.06-.029.06-.028.061-.025.061-.023.062-.021.062-.019.063-.017.063-.015.063-.013.063-.01.064-.009.064-.006.063-.005.064-.002.064-.001.063.002.064.004.063.005.063.008.063.009.062.012.062.013.061.016 5.679-5.679-.016-.062-.013-.063-.012-.063-.01-.063-.007-.064-.006-.064-.003-.064-.002-.064.001-.064.003-.064.004-.064.007-.063.009-.064.011-.063.013-.063.015-.063.017-.063.019-.062.021-.061.023-.061.025-.06.028-.06.029-.059.032-.058.033-.057.036-.057.038-.055.04-.055.042-.053.044-.053.046-.051.048-.05.036-.035.036-.034.037-.033.038-.032.039-.031.039-.03.04-.029.04-.028.041-.027.042-.025.042-.025.043-.024.043-.022.044-.022.044-.02.045-.019.045-.018.046-.017.046-.016.046-.015.047-.013.047-.013.048-.011.048-.01.048-.009.049-.008.049-.007.049-.005.049-.005.05-.003.05-.001.05-.001.05.001zm-5.349 8.712l3.536 3.537 1.773-1.774 1.107 1.211 2.532 2.775 1.432 1.57 1.345 1.478.594.654.518.571.421.466.308.343.028.032.029.032.031.031.033.029.034.029.035.027.037.026.038.024.038.023.04.02.04.018.041.016.041.013.042.01.021.004.021.003.021.002.021.002.027.001.026.001.025-.001.025-.001.024-.003.024-.002.024-.004.023-.004.044-.011.041-.012.04-.015.037-.016.035-.017.033-.018.03-.019.029-.019.025-.019.024-.019.021-.018.018-.017.029-.028.027-.029.026-.031.023-.031.023-.032.02-.033.018-.034.017-.035.015-.035.013-.035.011-.037.009-.036.008-.037.005-.037.003-.038.001-.037-.001-.038-.003-.039-.005-.038-.007-.037-.009-.037-.011-.037-.014-.037-.015-.036-.016-.035-.019-.035-.021-.034-.022-.034-.025-.034-.026-.032-.028-.033-.03-.031-.078-.07-.041-.034-.024-.02-.016-.015-.189-.174-.217-.202-.242-.226-.265-.25-.591-.559-.656-.625-.705-.674-.735-.705-.748-.719-.744-.717-1.405-1.356-1.177-1.138-1.11-1.076 1.634-1.635-3.537-3.536-3.882 3.884zm-1.415 1.415l-1.411.003-.001.001 4.947 4.946.001-1.413-3.535-3.537h-.001zm6.714-6.716l-.002.003 3.536 3.536.002-.002 1.412-.002-4.948-4.948v1.413z" />
          </svg>
          <span style={{ marginLeft: 8 }}>{info.getValue()}</span>
        </span>
      ) : '',
      header: <span style={{ marginRight: 0 }}>Name</span>
    }),
    columnHelper.accessor(row => row.count, {
      id: 'count',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Count</span>
    })
  ]

  const mpColumns = [

    columnHelper.accessor('title', {
      cell: info => info.getValue() ? (
        <span onClick={() => onQueryMp(info.row.original.id)} style={{ textWrap: 'nowrap' }}>
          <svg
            className="votingHistory__table-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" />
          </svg>
          <span style={{ marginLeft: 8 }}>{info.getValue()}</span>
        </span>
      ) : '',
      header: () => <span>Name</span>
    }),
    columnHelper.accessor('party', {
      cell: info => info.getValue(),
      header: () => <span>Party</span>
    }),
    columnHelper.accessor(row => row.count, {
      id: 'count',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Count</span>
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

    const nameParam = name || "Any";

    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${party}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${nameParam}`;

    if (type === 'Division' && voteType !== 'on') {
      const ayeOrNo = voteType === "for" ? "aye" : "no";
      url = `${url}&ayeorno=${ayeOrNo}`;
    }

    const result = await ky(url).json();

    const formattedResult = [];
    if (type === 'Division') {
      setColumns(divisionColumns);
      result.forEach(i => {
        const row = { title: i._fields[0], count: i._fields[1].low, id: i._fields[2].low };
        formattedResult.push(row);
      });
    } else {
      setColumns(mpColumns);
      result.forEach(i => {
        const row = { title: i._fields[0], party: i._fields[1], count: i._fields[2].low, id: i._fields[3].low };
        formattedResult.push(row);
      });
    }

    setData(formattedResult);

    setProgress(false);
  }

  return (

    <div className="insights">

      <div className="wrapper">
      
        <div className="insights__query">

          <span className='fixedLabel'>Which</span>

          <select
            className="select fixedInput"
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

          <span className='fixedLabel'>{type === "MP" ? "Name" : "Title"}</span>

          <input
            className="input fixedInput"
            type="search"
            placeholder="includes text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {type === 'Division' && (
            <>
              <span className='fixedLabel'>type</span>

              <select
                className="select fixedInput"
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

            </>

          )}

          {type === 'MP' && (
            <span className='fixedLabel'>from</span>
          )}

          {type === 'MP' && (

            <select
              className="select fixedInput"
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


          )}


          {type === 'MP' ? <span className='fixedLabel'>voted the</span> : <span className='fixedLabel'>was voted</span>}

          {type === 'Division' && (
            <select
              className="select fixedInput"
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

          {type === 'Division' && <span className='fixedLabel'>the</span>}

          <select
            className="select fixedInput"
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


          {type === 'MP' && (
            <>
              <span className='fixedLabel'>on</span>

              <select
                className="select fixedInput"
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
            </>

          )}

          <label className='fixexLabel' htmlFor="start">Between</label>

          <div style={{ padding: 0, paddingLeft: 0 }} className="datePicker fixedInput select">

            <input
              type="date"
              id="start"
              name="from-date"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
              value={fromDate}
            />

            {/* <label for="start" style={{ marginLeft: 8, marginRight: 8 }}>and:</label> */}
            <input
              style={{ marginLeft: 8 }}
              type="date"
              id="toDate"
              name="to-date"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
              value={toDate}
            />
          </div>

          <button
            className='button fixedButton'
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
