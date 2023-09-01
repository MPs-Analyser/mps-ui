import { useState, useEffect, useRef  } from 'react'

import NavBar from './NavBar';
import DivisionDetails from './DivisionDetails';
import About from './About';
import Search from './Search';
import Toast from './Toast';

import "./styles/index.css";

const App = () => {

  const [page, setPage] = useState('home');  
  const [globalMessage, setGlobalMessage] = useState({ text: undefined, type: undefined });

  const container = useRef(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    theme && document.body.classList.add(theme);
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

  const onHandleError = (message) => {
    setGlobalMessage(message)
  }

  const onToggleSearchBar = () => {      
    container.current.scrollTo(0, 0);    
    document.querySelector('.wrapper input').focus();
  }

  return (

    <main>

      <NavBar setPage={setPage} handleThemeToggle={handleThemeToggle} onToggleSearchBar={onToggleSearchBar} />

      <div className="container" ref={container}>
        {page === 'home' && (
          <Search setGlobalMessage={setGlobalMessage}/>
        )}

        {page === 'divison' && (
          <DivisionDetails onHandleError={onHandleError} />
        )}

        {page === 'about' && <About />}

        {globalMessage.type && <Toast message={globalMessage} />}
      </div>


    </main>
  )
}

export default App
