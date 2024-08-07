import React from 'react';
import LogoC from'./AssetsHeaderS/LogoC.png'
import './HeaderSubP.css'
export default function HeaderSubP({title}) {
  return (
    <div>

        <header className='headerSub'>  
        <img src={LogoC} alt="Right" className='imagesub2' />
            <h1>{title}</h1>
            <img src={LogoC} alt="Right" className='imagesub' />
        </header>
        


    </div>
  )
}
