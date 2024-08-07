import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleUser, faUserGraduate, faChalkboardUser, faMoneyBill} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './CardsOptions.css';

export default function CardsOptions ({icono, action, widhtFont, enlace}){
    return(
            <Link to={enlace} className="card">
                    <FontAwesomeIcon icon={icono} fontSize={widhtFont} color="white"/>
                    <p>{action}</p>
            </Link>   
    );
}
