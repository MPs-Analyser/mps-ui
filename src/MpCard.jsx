import { useEffect } from 'react';

import * as React from 'react'
import "./styles/browse.css";

// import { config } from './app.config';

// import ky from 'ky-universal';

const MpCard = ({ onQueryMp, item = { startDate: { year: {} } } }) => {


  useEffect(() => {
    //get all mps     
  }, [item]);

  return (
    <div className='browse__card' onClick={() => onQueryMp(item.id)} >
      <span><h4>{item.name}</h4> <img className='browse__card__img' src={`https://members-api.parliament.uk/api/Members/${item.id}/Thumbnail`} alt="Paris" loading="lazy"></img></span>
      <span>{item.gender}</span>
      <span>{item.party}</span>
      <p>{item.startDate.day.low}/{item.startDate.month.low}/{item.startDate.year.low}</p>
      <div className="votecounts">
        <span className='gridheader'>Votes</span>
        <span className='gridheader'>Aye</span>
        <span className='gridheader'>No</span>
        <span>{item.totalVotes}</span>
        <span>{item.ayeVotes}</span>
        <span>{item.noVotes}</span>
      </div>
    </div>
  )
}

export default MpCard;
