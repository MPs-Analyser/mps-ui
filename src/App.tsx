// @ts-nocheck
import { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import './App.css'

import ky from 'ky-universal';

function App() {

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

  const handleThemeToggle = () => {

    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light-mode');
    } else {
      localStorage.removeItem('theme');
      document.body.removeAttribute('class');
    }
  };

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

    <main>
      <header>
        <h3>Select an MP</h3>
        <button onClick={handleThemeToggle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm2.312-4.897c0 2.206 1.794 4 4 4s4-1.794 4-4-1.794-4-4-4-4 1.794-4 4zm10 0c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" /></svg>
        </button>

      </header>
      <div className="autoComplete">

        <ReactSearchAutocomplete
          items={names}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          autoFocus
          formatResult={formatResult}
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
        <table>
          <tbody>
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

    </main>
  )
}

export default App
