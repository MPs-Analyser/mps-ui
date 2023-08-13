// @ts-nocheck
import { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import './App.css'

import ky from 'ky-universal';

function Mp() {

  const [names, setNames] = useState([]);
  const [details, seDetails] = useState();
  const [votingSimilarity, setVotingSimilarity] = useState();  

  const getMpNames = async () => {
    console.log('get names');
    const result = await ky('http://localhost:8000/mpnames').json();
    setNames(result);
  }

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    theme && document.body.classList.add(theme);
    console.log('theme is ', theme);
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
    const result = await ky(`http://localhost:8000/votingSimilarity?name=${details?.value?.nameDisplayAs}`).json();
    console.log('votingSimilarity ', result);
    setVotingSimilarity(result);
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

      {details && (

        <section className="details">

          <img src={`${details.value?.thumbnailUrl}`} />

          <div className="details__overview">
            <table>
              <tbody>
                <tr>
                  <th>Party</th>
                  <td>{details.value.latestParty?.name}</td>
                </tr>
                <tr>
                  <th>Constituency</th>
                  <td>{details.value.latestHouseMembership?.membershipFrom}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="details__actions">
            <button onClick={onGetVotingSimilarity}>Most Similar Voting Mps</button>
            <button>Least Similar Voting Mps</button>
          </div>

        </section>
      )}

      {votingSimilarity && (
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

      )}
    </>

  )
}

export default Mp
