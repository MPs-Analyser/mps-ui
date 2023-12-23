import { useEffect, useState } from 'react';

import "./styles/browse.css";

import { config } from './app.config';
import ky from 'ky-universal';

const Parties = () => {

  const [parties, setParties] = useState([]);
  const [donations, setDonations] = useState();

  useEffect(() => {

    const getParties = async () => {

      const mpsResponse = await ky(`${config.mpsApiUrl}getparties`).json();
      setParties(mpsResponse);

      const donationsResponse = await ky(`${config.mpsApiUrl}donations`).json();
      setDonations(donationsResponse);
    }

    getParties();

  }, []);

  return (
    <div>

      <table>
        <thead>
          <tr>
            <th>Party</th>
            <th>Members Count</th>
            <th>Donation Count</th>
            <th>Donation Amount</th>
          </tr>
        </thead>
        <tbody>
          {parties && donations && donations.map(i => (
              <tr>
                <td>{i.partyName}</td>
                <td>{parties.find(party => party.name === i.partyName) ? parties.find(party => party.name === i.partyName).mpsCount : ''}</td>
                <td>{i.donationCount}</td>
                <td>{i.totalDonationValue}</td>
              </tr>      
      ))}
        </tbody>
      </table>


      {/* {parties && parties.map(i => (
        <p>{i.name}: {i.mpsCount}</p>
      ))}

      {donations && donations.map(i => (
        <p>{i.partyName}: {i.donationCount} {i.totalDonationValue}</p>
      ))} */}
    </div>
  )
}

export default Parties;
