import { useState, useEffect } from 'react'
import './App.css'

import VotingHistory from './VotingHistory';

import ky from 'ky-universal';
import BarChart from './BarChart';

const Mp = ({ votingSummary, details, onQueryMpByName, onQueryMp }) => {

  const [votingSimilarity, setVotingSimilarity] = useState();
  const [votingHistory, setVotingHistory] = useState();
  const [barChartData, setBarChartData] = useState();
  const [votingAnalysis, setVotingAnalysis] = useState();

  useEffect(() => {
    console.log('details ', details);
  }, []);

  const onGetVotingSimilarity = async () => {
    //clear voting history to make space for similarity
    setVotingHistory(undefined);
    const result = await ky(`http://localhost:8000/votingSimilarity?name=${details?.value?.nameDisplayAs}`).json();
    console.log('votingSimilarity ', result);
    setVotingSimilarity(result);

    const chartData = {
      labels: [],
      datasets: [
        {
          label: 'Voting Similarity',
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: []
        }
      ]
    }

    result.records.forEach(element => {
      console.log(element);
      chartData.labels.push(element._fields[1])
      chartData.datasets[0].data.push(element._fields[2])
    });


    setBarChartData(chartData);

  }

  const onGetVotingHistory = async (type) => {

    //clear similarity to make space for voting history
    setVotingSimilarity(undefined);
    setBarChartData(undefined);
    setVotingHistory({ isInProgress: true })

    const response = await ky(`http://localhost:8000/votingDetails?name=${details?.value?.nameDisplayAs}&type=${type}`).json();

    const formattedResults = [];

    console.log('result ', response);

    response.records.forEach(i => {
      console.log('field ', i._fields);
      const memberVotedAye = type === "votedAye" ? true : type === "votedNo" ? false : i._fields[3];

      formattedResults.push({
        divisionId: i._fields[0],
        title: i._fields[1],
        date: i._fields[2],
        memberVotedAye
      })
    });


    setVotingHistory(formattedResults);
  }

  const analyseVoting = () => {
    setVotingAnalysis({ hello: true });
  }

  return (

    <>
      <section className="details">

        <div className="mpTitleWrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          <div              
              style={{
                width: 40,
                height: 40,
                background: `#${details?.value?.latestParty?.backgroundColour}`,
                color: `#${details?.value?.latestParty?.foregroundColour}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}>
              <svg fill={`#${details?.value?.latestParty?.foregroundColour}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" /></svg>
            </div>
            <h4>{details.value.nameDisplayAs}</h4>
          </div>
          
        </div>

        <img className='mpImage' src={`${details.value?.thumbnailUrl}`} />

        <div className="details__overview">
          <table>
            <tbody>
              <tr>
                <th>Constituency</th>
                <td>{details.value.latestHouseMembership?.membershipFrom}</td>
              </tr>
              <tr>
                <th>House</th>
                <td>{details.value.latestHouseMembership?.house === 1 ? 'Commons' : 'Lords'}</td>
              </tr>
              <tr>
                <th>Member Since</th>
                <td>{details.value.latestHouseMembership?.membershipStartDate}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{details.value.latestHouseMembership?.membershipStatus ? `Active` : `Inactive`}</td>
              </tr>
              <tr>
                <th>Status Description</th>
                <td>{details.value.latestHouseMembership?.membershipStatus?.statusDescription}</td>
              </tr>
            </tbody>
          </table>

          <div className="votingSummary">
            <h3>Voting Summary</h3>
            <table>
              <tr>
                <th>Total Votes</th>
                <td>{votingSummary?.total}</td>
                <td><button onClick={() => onGetVotingHistory('all')}>View</button></td>
              </tr>
              <tr>
                <th>Voted Aye</th>
                <td>{votingSummary?.votedAye}</td>
                <td><button onClick={() => onGetVotingHistory('votedAye')}>View</button></td>
              </tr>
              <tr>
                <th>Voted No</th>
                <td>{votingSummary?.votedNo}</td>
                <td><button onClick={() => onGetVotingHistory('votedNo')}>View</button></td>
              </tr>
            </table>
          </div>


        </div>

        <div className="details__actions">
          <button onClick={onGetVotingSimilarity}>Most Similar Voting Mps</button>
          <button>Least Similar Voting Mps</button>
          <button onClick={onGetVotingHistory}>Voting History</button>
        </div>

      </section>


      {votingSimilarity && (
        <>
          <BarChart barChartData={barChartData} onQueryMpByName={onQueryMpByName} />

          <table className='table__similarity'>
            <tbody>
              <tr>
                <th>#</th>
                <th>This Mp</th>
                <th>Other Mp</th>
                <th>Similarity</th>
              </tr>
              {
                votingSimilarity.records.map((record, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{record._fields[0]}</td>
                    <td>{record._fields[1]}</td>
                    <td>{record._fields[2]}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </>
      )}

      {votingHistory && !votingHistory.isInProgress && (
        <div className='votingHistoryWrapper__summarise' >
          <button onClick={analyseVoting}>Summarise Voting History</button>
          <span>Send table data to AI to sumarise</span>
        </div>
      )}

      {votingAnalysis && (
        <div className='votingHistoryWrapper'>
          <table>
            <tr>
              <td>Stance towards EU</td>
              <td>Pro EU</td>
              <td>Based on this voting pattern, the MP seems to have generally supported the Brexit process and the withdrawal of the United Kingdom from the European Union. They voted in favor of the Withdrawal Agreement Bill, government motions related to the EU withdrawal, and other bills related to the transition. However, their stance might be more nuanced and context-specific than what can be derived solely from this voting record.</td>

            </tr>
            <tr>
              <td>Position on Immigration</td>
              <td>Anti Immigration</td>
              <td>Based on this voting pattern, the MP seems to have voted against various immigration-related measures, including those related to the Immigration and Social Security Co-ordination Bill. However, they voted in favor of a motion related to migration and Scotland. It's important to note that this voting record might not fully capture the intricacies of the MP's overall stance on immigration and related policies, as individual votes may be influenced by various factors and nuances.</td>

            </tr>
          </table>
        </div>

      )}

      {votingHistory && votingHistory.isInProgress && (
        <>
          <div className="votingHistoryProgress">
            <progress value={null} />
            <p>Analysing voting history...</p>
          </div>

        </>

      )}

      {votingHistory && !votingHistory.isInProgress && (
        <VotingHistory votingHistory={votingHistory} onQueryMp={onQueryMp} />
      )}

    </>

  )
}

export default Mp;
