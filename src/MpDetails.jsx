import { useState, useEffect } from 'react'

import VotingHistory from './VotingHistory';

import PartyLogo from './PartyLogo';

import "./styles/mpDetails.css";

import ky from 'ky-universal';
import BarChart from './BarChart';

import { config } from '../src/app.config';

const MpDetails = ({ votingSummary, details, onQueryMpByName, onQueryMp, onQueryDivision, setGlobalMessage }) => {

  const [votingSimilarity, setVotingSimilarity] = useState();
  const [votingHistory, setVotingHistory] = useState();
  const [barChartData, setBarChartData] = useState();

  useEffect(() => {
    console.log('details ', details);
  }, []);

  const onGetVotingSimilarity = async () => {
    //clear voting history to make space for similarity
    setVotingHistory(undefined);    
    const result = await ky(`${config.mpsApiUrl}votingSimilarity?name=${details?.value?.nameDisplayAs}`).json();
    console.log('votingSimilarity ', result);
    setVotingSimilarity(result.similarity);

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

    result.similarity.forEach(element => {
      console.log(element);
      chartData.labels.push(element.name)
      chartData.datasets[0].data.push(element.score)
    });


    setBarChartData(chartData);

  }

  const onGetVotingHistory = async (type) => {

    //clear similarity to make space for voting history
    setVotingSimilarity(undefined);
    setBarChartData(undefined);
    setVotingHistory({ isInProgress: true })

    try {
      const response = await ky(`${config.mpsApiUrl}votingDetails?id=${details?.value?.id}&type=${type}`).json();
      const formattedResults = [];

      console.log('result ', response);

      response.forEach(i => {
        console.log('field ', i._fields);
        // const memberVotedAye = type === "votedAye" ? true : type === "votedNo" ? false : 'dont know';

        formattedResults.push({
          divisionId: i.DivisionId,
          title: i.Title,
          date: i.Date,
          memberVotedAye: i.memberVotedAye
        })
      });

      setVotingHistory(formattedResults);
    } catch (error) {
      console.error(error);
      setVotingHistory(undefined);
      setGlobalMessage({ type: 'error', text: error.message });
    }

  }


  return (

    <>
      <section className="mpDetails">

        <div className="mpDetails_image_title">

          <img className='mpDetails__image' src={`${details.value?.thumbnailUrl}`} />

          <div className="mpDetails__titleWrapper">
            <div className="mpDetails_logo_title">
              <PartyLogo
                backgroundColour={`#${details?.value?.latestParty?.backgroundColour}`}
                foregroundColour={`#${details?.value?.latestParty?.foregroundColour}`}
                partyName={details?.value?.latestParty?.name}
              />
              <span>
                <h4>{details.value.nameDisplayAs}</h4>
              </span>

            </div>

            <div className="house__tooltop">
              {details.value.latestHouseMembership?.house === 1 ? 'House of Commons' : 'House of Lords'}
            </div>
            <div className="house__wrapper">
              <img className='mpDetails__house' src={details.value.latestHouseMembership?.house === 1 ? './src/assets/commons.png' : './src/assets/lords.png'} />
            </div>

          </div>



        </div>


        <div className="mpDetails__overview">
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
                <td>{details.value.latestHouseMembership && details.value.latestHouseMembership?.membershipStartDate.substring(0, 10)}</td>
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

          {votingSummary && (
            <div className="votingSummary">
              <h3>Voting Summary</h3>
              <table>
                <tr>
                  <th>Total Votes</th>
                  <td>{votingSummary?.votedAye?.length + votingSummary?.votedNo?.length}</td>
                  <td><button onClick={() => onGetVotingHistory('all')}>View</button></td>
                </tr>
                <tr>
                  <th>Voted Aye</th>
                  <td>{votingSummary?.votedAye?.length || 0}</td>
                  <td><button onClick={() => onGetVotingHistory('votedAye')}>View</button></td>
                </tr>
                <tr>
                  <th>Voted No</th>
                  <td>{votingSummary?.votedNo?.length || 0}</td>
                  <td><button onClick={() => onGetVotingHistory('votedNo')}>View</button></td>
                </tr>
              </table>
            </div>

          )}


        </div>

        <div className="mpDetails__actions">
          <button onClick={onGetVotingSimilarity}>Most Similar Voting Mps</button>
          <button>Least Similar Voting Mps</button>
          <button onClick={() => onGetVotingHistory('all')}>Voting History</button>
        </div>

      </section>


      {votingSimilarity && (
        <>
          <BarChart barChartData={barChartData} onQueryMpByName={onQueryMpByName} />

          <table className='table__similarity'>
            <tbody>
              <tr>
                <th>#</th>
                <th>Other Mp</th>
                <th>Similarity</th>
              </tr>
              {
                votingSimilarity.map((record, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{record.name}</td>
                    <td>{record.score}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </>
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
        <VotingHistory votingHistory={votingHistory} onQueryMp={onQueryMp} onQueryDivision={onQueryDivision} />
      )}

    </>

  )
}

export default MpDetails;
