import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosReturnLeft } from "react-icons/io";
import './BotonReturn.css'


export default function BotonReturn({ enlace }) {
  return (
    <div >
      <Link to={enlace}>
        <button className='BotonReturn'>
           <IoIosReturnLeft className='icon-return'/> 
        </button>
      </Link>
    </div>
  );
}
