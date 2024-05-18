import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('');
  const [scrapedData, setScrapedData] = useState(null);

  return (
    <>
      <div className='masterDiv'>
        <div className='Header'>
          <h1>Bird Scraper</h1>
          <p>You're not supposed to see this haha.</p>
          <p>Copy and paste a wikipedia link into the form below and
            edit the data until it is workable.
          </p>
        </div>
          <form action="">
            <label htmlFor="url">URL here:</label>
            <input type="text" id='url' value={url} onChange={(e) => setUrl(e.target.value)}/>
          </form>
        <div className='birdData'>
        
        </div>
      </div>
    </>
  )
}

export default App
