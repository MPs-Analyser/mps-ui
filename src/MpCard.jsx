import { useEffect  } from 'react';

import * as React from 'react'
import "./styles/browse.css";

// import { config } from './app.config';

// import ky from 'ky-universal';

const MpCard = ({ onQueryMp, item={ startDate: { year: {}}} }) => {


  useEffect(() => {
    //get all mps 
    console.log("render MP ", item);
  }, [item]);

  return (
    <div className='browse__card' onClick={() => onQueryMp(item.id)}>
      <span><h4>{item.name}</h4> <img className='browse__card__img' src={`https://members-api.parliament.uk/api/Members/${item.id}/Thumbnail`} alt="Paris" loading="lazy"></img></span>
      <span>{item.gender}</span>
      <span>{item.party}</span>
      <p>{item.startDate.year.low}</p>
      total:<span>{item.totalVotes}</span>
      aye: <span>{item.ayeVotes}</span>
      no:<span>{item.noVotes}</span>
      
    </div>
  )
}

export default MpCard;
