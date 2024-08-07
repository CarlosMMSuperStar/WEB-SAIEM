import React from 'react'
import './HeaderPaginas.css';

export default function HeaderPaginas({ title }) {
  return (
    <div>
        <header className='header'>  
             <h1>{title}</h1>
        </header>
    </div>
  )
}
