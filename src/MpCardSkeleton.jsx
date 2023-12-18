import * as React from 'react'
import "./styles/browse.css";


const MpCard = () => {

  return (
    <div style={{ height: 350 }} className='browse__card' >    
      <h4 style={{ width: "70%", padding: 8 }} className='skeleton-text  skeleton'></h4>
      {/* <img style={{ width: "100%" }} className='browse__card__img' src={`https://members-api.parliament.uk/api/Members/${item.id}/Thumbnail`} alt="Paris" loading="lazy"></img> */}
      <div style={{ width: "100%", height: "50%", marginLeft: -2 }} className='browse__card__img skeleton'></div>
      <span style={{ width: "60%", marginTop: 10, marginBottom: 6, padding: 4 }} className='skeleton-text  skeleton'></span>
      <p style={{ width: "40%", padding: 4 }} className='skeleton-text  skeleton'></p>
      <div className="votecounts">
        <span className='gridheader'>Votes</span>
        <span className='gridheader'>Aye</span>
        <span className='gridheader'>No</span>
        <span className='skeleton-grid-item skeleton-text skeleton'></span>
        <span className='skeleton-grid-item skeleton-text skeleton'></span>
        <span className='skeleton-grid-item skeleton-text skeleton'></span>
      </div>
    </div>
  )
}

export default MpCard;
