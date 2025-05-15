import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import MainPage from './components/MainPage/MainPage'
import CharitiesPage from './components/CharitiesPage/CharitiesPage'

function App() {

  return (
    <>
    <BrowserRouter>
      <div className='page'>
        <Navbar/>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/charities' element={<CharitiesPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
