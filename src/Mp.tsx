// @ts-nocheck
import { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import './App.css'

import VotingHistory from './VotingHistory';

import ky from 'ky-universal';
import BarChart from './BarChart';



function Mp() {

  const [names, setNames] = useState([]);
  const [details, seDetails] = useState({});
  const [votingSimilarity, setVotingSimilarity] = useState();
  const [votingHistory, setVotingHistory] = useState();
  const [barChartData, setBarChartData] = useState();

  const getMpNames = async () => {
    console.log('get names');
    const result = await ky('http://localhost:8000/mpnames').json();
    setNames(result);
  }

  useEffect(() => {
    getMpNames();
  }, []);

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result)
  }

  const handleOnSelect = async (item) => {
    // the item selected
    seDetails(undefined);
    console.log('select', item)

    const result = await ky(`https://members-api.parliament.uk/api/Members/${item.id}`).json();

    console.log('result ', result);
    seDetails(result);

  }

  const handleOnFocus = () => {
    console.log('Focused')
  }

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>id: {item.id}</span>
        <span style={{ display: 'block', textAlign: 'left' }}>name: {item.name}</span>
      </>
    )
  }

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

  const onGetVotingHistory = async () => {

    //clear similarity to make space for voting history
    setVotingSimilarity(undefined);
    setBarChartData(undefined);
    
    setVotingHistory({ isInProgress: true })


    const allResults = [];
    let moreResultsAvailable = true;
    let skip = 0;

    while (moreResultsAvailable) {

      const result = await ky(`https://commonsvotes-api.parliament.uk/data/divisions.json/membervoting?queryParameters.memberId=${details?.value?.id}&queryParameters.skip=${skip}&queryParameters.take=25`).json();
      console.log('votinghistory ', result);

      if (result && result.length) {
        allResults.push(...result);
        skip = skip + 25;
      } else {
        moreResultsAvailable = false;
      }

    }

    console.log('allResults ', allResults);
    setVotingHistory(allResults);
  }

  return (

    <>
      <div className="autoComplete">

        <ReactSearchAutocomplete
          items={names}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          autoFocus
          formatResult={formatResult}
          placeholder='Start typing to select an MP'
        />

      </div>

      {!details && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2em' }}>
          <progress value={null} />
        </div>
      )}


      {details && details.value && (

        <section className="details">

          <img src={`${details.value?.thumbnailUrl}`} />

          <div className="details__overview">
            <table>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{details.value.id}</td>
                </tr>
                <tr>
                  <th>Party</th>
                  <td>{details.value.latestParty?.name}</td>
                </tr>
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
                  <td>{details.value.latestHouseMembership?.membershipStatus.statusDescription}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="details__actions">
            <button onClick={onGetVotingSimilarity}>Most Similar Voting Mps</button>
            <button>Least Similar Voting Mps</button>
            <button onClick={onGetVotingHistory}>Voting History</button>
          </div>

        </section>
      )}




      {votingSimilarity && (

        <>
          <BarChart barChartData={barChartData} />

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

      {votingHistory && votingHistory.isInProgress && (
        <div className="votingHistoryProgress">
          <progress value={null} />
          <p>Analysing voting history...</p>
        </div>
      )}


      {votingHistory && !votingHistory.isInProgress && (
        <div className='votingHistoryWrapper'>

          <div className='votingHistoryWrapper__summarise' >
            <button>Summarise Voting History</button>
            <span>Send table data to AI to sumarise</span>
          </div>

          <VotingHistory votingHistory={votingHistory} />
        </div>

      )}
    </>

  )
}

export default Mp
