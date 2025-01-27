import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar/Navbar'
import MainPage from './components/MainPage/MainPage'

function App() {

  return (
    <>
    <div className='page'>
      <Navbar/>
      <MainPage/>
    </div>
    </>
  )
}

export default App
