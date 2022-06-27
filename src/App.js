import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    document.querySelector('.slbz').innerHTML = number;
  })

  return (
    <div className="App">
       <section>
          <div className='content'>
              <span className='slbz'>0</span>
              <p>NEW TEXT HERE</p>
          </div>
          <div>counter 2</div>
       </section>
 
    </div>
  );
}

export default App;
