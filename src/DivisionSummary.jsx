import * as React from 'react'

import './votingHistory.css';

function DivisionSummary({ onQueryMp, division }) {

  React.useEffect(() => {
  }, []);

  return (
    <div className="divisionSummary">

      {division && (
        <div className="votingHistory__division">
          <h3>Divison Summary</h3>

          <ul>
            <li>id: {division.id}</li>
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
                  onClick={() => onQueryMp(division.Ayes[0]?.MemberId)}>
                  {division.Ayes[0]?.Name}
                </button>
              </li>
              <li>
                <button
                  className='button-link'
                  onClick={() => onQueryMp(division.Ayes[1]?.MemberId)}>
                  {division.Ayes[1]?.Name}
                </button>
              </li>
              <li>.....</li>
            </ul>

            <h4>Members who voted No</h4>
            <ul>
              <li>
                <button
                  className='button-link'
                  onClick={() => onQueryMp(division.Noes[0]?.MemberId)}>
                  {division.Noes[0]?.Name}
                </button>
              </li>
              <li>
                <button
                  className='button-link'
                  onClick={() => onQueryMp(division.Noes[1]?.MemberId)}>
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

export default DivisionSummary;