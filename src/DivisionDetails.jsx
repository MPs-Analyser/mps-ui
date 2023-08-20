import * as React from 'react'
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import './votingHistory.css';


const DivisionDetails = ({ onQueryMp, division }) => {

  const [votedAye, setVotedAye] = React.useState(() => [[]]);
  const [votedNo, setVotedNo] = React.useState(() => [[]]);
  const [absent, setAbsent] = React.useState(() => [[]]);

  const AyeRow = ({ index, style }) => (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
      <span>{votedAye[index].id}</span>      
      <span>{votedAye[index].name}</span>
    </div>
  );

  const NoRow = ({ index, style }) => (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
      <span>{votedNo[index].id}</span>      
      <span>{votedNo[index].name}</span>
    </div>
  );

  const AbsentRow = ({ index, style }) => (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
      <span>{absent[index].id}</span>      
      <span>{absent[index].name}</span>
    </div>
  );


  React.useEffect(() => {
    console.log('division ', division);

    const ayesList = [];
    division.Ayes.forEach(i => ayesList.push({ id: i.MemberId, name: i.Name }));
    setVotedAye(ayesList);

    const noList = [];
    division.Noes.forEach(i => noList.push({ id: i.MemberId, name: i.Name }));
    setVotedNo(noList);

    const absentList = [];
    division.NoVoteRecorded.forEach(i => absentList.push({ id: i.MemberId, name: i.Name }));
    setAbsent(absentList);


    // setData(ayesList)
  }, [division]);

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
            <li>Absent: {division.NoVoteRecorded.length}</li>
          </ul>
        </div>
      )}



      <div className='ayesListWrapper' style={{ height: '300px', overflowX: 'hidden', display: 'flex' }}>

        <div style={{ height: '100%', border: '1px solid', flex: 1 }}>
          <h3>Voted Aye</h3>
          <AutoSizer>
            {({ height, width }) => (

              <List
                className="List"
                height={height}
                itemSize={35}
                itemCount={votedAye.length}
                width={width}
              >
                {AyeRow}
              </List>
            )}
          </AutoSizer>
        </div>

        <div style={{ height: '100%', border: '1px solid', flex: 1 }}>
          <h3>Voted No</h3>
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="List"
                height={height}
                itemCount={votedNo.length}
                itemSize={35}
                width={width}
              >
                {NoRow}
              </List>
            )}
          </AutoSizer>
        </div>

        <div style={{ height: '100%', border: '1px solid', flex: 1 }}>
          <h3>Absent</h3>
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="List"
                height={height}
                itemCount={absent.length}
                itemSize={35}
                width={width}
              >
                {AbsentRow}
              </List>
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  )
}

export default DivisionDetails;