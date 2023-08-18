// @ts-nocheck
import * as React from 'react'

import './votingHistory.css';

function DivisionDetails({ onQueryMp, division }) {

  React.useEffect(() => {
  }, []);

  return (
    <div className="divisionDetails">

      {division && (
        <div className="votingHistory__division">
          <h3>Divison Details</h3>

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

export default DivisionDetails;