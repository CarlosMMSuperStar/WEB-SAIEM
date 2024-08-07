import React from 'react'
import { LuHome } from "react-icons/lu";
import './BotonInicio.css'
import { Link } from 'react-router-dom';



export default function BotonInicio() {
  return (
    
                <Link  to={'/inicio'}>
                    <button className='ButtonInicio'><LuHome className='icon-BInicio'/></button>
                </Link>
    
  )
}