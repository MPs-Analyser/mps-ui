// @ts-nocheck
import { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import './App.css'

import About  from './About';
import ky from 'ky-universal';

function App() {

  const [names, setNames] = useState([]);
  const [details, seDetails] = useState();
  const [votingSimilarity, setVotingSimilarity] = useState();
  const [page, setPage] = useState('home');

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
        <h3>MP Analiser</h3>

        <div className='buttons'>

          <button className="header__button" onClick={() => setPage('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h18v-10h3zm-5 8h-14v-10.26l7-6.912 7 6.99v10.182zm-5-1h-4v-6h4v6z"/></svg>
          </button>

          <button className="header__button" onClick={() => setPage('about')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z" /></svg>
          </button>

          <button className="header__button" onClick={handleThemeToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm2.312-4.897c0 2.206 1.794 4 4 4s4-1.794 4-4-1.794-4-4-4-4 1.794-4 4zm10 0c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" /></svg>
          </button>
        </div>
      </header>

      {page === 'home' && (
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
        </>
      )}

    {page === 'about' && <About />}

    </main>
  )
}

export default App
