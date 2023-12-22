import { useEffect, useState } from 'react';

import "./styles/browse.css";

import { config } from './app.config';
import ky from 'ky-universal';

const Parties = () => {

  const [parties, setParties] = useState();

  useEffect(() => {

	const getParties = async () => {
		const response = await ky(`${config.mpsApiUrl}getparties`).json();
    console.log("got ", parties);
    
    setParties(response);
	}

	getParties();
    
  }, []);

  return (
    <div>
      {parties && parties.map(i => (
        <p>{i.name}: {i.mpsCount}</p>
      ))}
    </div>
  )
}

export default Parties;
