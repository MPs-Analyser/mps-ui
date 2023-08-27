import './styles/logo.css'


const colourLookup = {
  Conservative: {
    backgroundColour: "rgb(0, 0, 255)",
    foregroundColour: "rgb(255, 255, 255)",
  },
  Labour: {
    backgroundColour: "#ff0000",
    foregroundColour: "#ffffff",
  },
  "Labour (Co-op)": {
    backgroundColour: "#ff0000",
    foregroundColour: "#ffffff",
  },
  "Scottish National Party": {
    backgroundColour: "#fcf28f",
    foregroundColour: "#000000",
  },
  "Liberal Democrat": {
    backgroundColour: "#f8a428",
    foregroundColour: "#FFFFFF",
  }
}

const PartyLogo = ({ backgroundColour, foregroundColour, partyName }) => {

  return (
    <div
      className='partyLogo'
      style={{      
        background: backgroundColour || colourLookup[partyName]?.backgroundColour || 'lightgrey',
        color: foregroundColour || colourLookup[partyName]?.foregroundColour,        
      }}>
      <div className="partyLogo__tooltop">        
        {partyName || 'Unknown Party'}
      </div>            
      <svg
        fill={foregroundColour || colourLookup[partyName]?.foregroundColour}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24">
        <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" />
      </svg>
    </div>

  )
}

export default PartyLogo
