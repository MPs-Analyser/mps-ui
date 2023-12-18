import { useEffect } from 'react';

import * as React from 'react'
import "./styles/browse.css";

// import { config } from './app.config';

// import ky from 'ky-universal';

const male = <svg className="standalone-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><path d="M16 2v2h3.586l-3.972 3.972c-1.54-1.231-3.489-1.972-5.614-1.972-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.125-.741-4.074-1.972-5.614l3.972-3.972v3.586h2v-7h-7zm-6 20c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" /></svg>
const female = <svg className="standalone-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><path d="M21 9c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.632 3.501 8.443 8 8.941v2.059h-3v2h3v2h2v-2h3v-2h-3v-2.059c4.499-.498 8-4.309 8-8.941zm-16 0c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" /></svg>

const MpCard = ({ onQueryMp, item = { startDate: { year: {} } } }) => {


  useEffect(() => {
    //get all mps     
  }, [item]);

  return (
    <div className='browse__card' onClick={() => onQueryMp(item.id)} >
      <div title={item.gender === "M" ? "Male" : "Female"} style={{ position: "absolute", right: 0, paddingRight: 4 }}>
        {item.gender === "M" ? male : female}
      </div>
      <h4>{item.name}</h4>
      <img style={{ width: "100%" }} className='browse__card__img' src={`https://members-api.parliament.uk/api/Members/${item.id}/Thumbnail`} alt="Paris" loading="lazy"></img>
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
