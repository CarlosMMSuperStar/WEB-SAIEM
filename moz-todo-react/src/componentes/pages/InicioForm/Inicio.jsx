import React from 'react';
import './Inicio.css';
import {faCircleUser, faUserGraduate, faChalkboardUser, faMoneyBill} from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect } from 'react';
import { ImExit } from "react-icons/im";
import CardsOptions from '../../Molecules/CardsInicio/CardsOptions';
import { LogInfoContext } from '../../../LogInfo';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import HeaderPaginas from '../../Molecules/HeaderPaginas/HeaderPaginas';
import BotonExit from '../../Atoms/BotonExit/BotonExit';
import Footer from '../../cells/Footer/Footer';
import LogoC from '../InicioForm/AssetsInicio/LogoC.png'
//La cabecera de la página, al ser un componente muy sencillo, sería una molécula, y el contenedor
//de las cards un ser vivo, además cada card es una molécula
export default function Inicio() {
  const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
  const navigate = useNavigate();

  const authentificateUser = async () => {
    const token = localStorage.getItem('token');
    if (!token || !isLoggedIn) {          
      Swal.fire({
        title: "Error",
        text: "Usted no ha iniciado sesión",
        icon: "error",
      });
      navigate('/')
      return false;
    } else {
      const idUsuario = localStorage.getItem('idUser');
      const url = `https://saiemapi.integrador.xyz/usersJWT/verify/${idUsuario}`;
      
      try{
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          const errorMessage = await respuesta.text(); 
          Swal.fire({
            title: 'Error',
            text: 'Error inesperado. Inténtalo de nuevo más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          localStorage.removeItem('token');
          localStorage.removeItem('idUser');
          localStorage.removeItem('typeUser')
          setIsLoggedIn(false)
          navigate('/');
          return;
        }
        else {
          console.log("Token vigente");
        }
      }catch(error){
        Swal.fire({
          title: 'Error',
          text: 'Token expirado, vuelva a iniciar sesion',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.log("Token expirado")
        localStorage.removeItem('token');
        localStorage.removeItem('idUser');
        localStorage.removeItem('typeUser');
        setIsLoggedIn(false)
        navigate('/')
        return;
      }
    }
  }

  useEffect(()=>{
    authentificateUser();
  }, []);

  const tipoUsuario = localStorage.getItem('typeUser');
  if(tipoUsuario == "employe"){
        return(
      <div className='menu'>
      <div>
        <HeaderPaginas title={"Instituto Montebello"}/>
        <BotonExit/>
      </div>

      <div className='content-cards'>  
        <CardsOptions
          icono={faUserGraduate} action={"Alumnos"} widhtFont={90} enlace={'/alumnos'}
        />

        <CardsOptions
          icono={faChalkboardUser} action={"Empleados/ Profesores"} widhtFont={90} enlace={'/empleados'}
        />

        <CardsOptions
          icono={faMoneyBill} action={"Informes de pago de trámites"} widhtFont={90} enlace={'/tramites'}
        />
      </div>

    </div>
    );
    
  }

  return (
    
    <div className='menu'>
      <div>
        <HeaderPaginas title={"Instituto Montebello"}/>
        <BotonExit/>
      </div>

      <div className='content-cards'>
          <CardsOptions
            icono={faCircleUser} action={"Usuarios"} widhtFont={100} enlace={'/usuarios'}
          />
        
        <CardsOptions
          icono={faUserGraduate} action={"Alumnos"} widhtFont={90} enlace={'/alumnos'}
        />

        <CardsOptions
          icono={faChalkboardUser} action={"Empleados/ Profesores"} widhtFont={90} enlace={'/empleados'}
        />

        <CardsOptions
          icono={faMoneyBill} action={"Informes de pago de trámites"} widhtFont={90} enlace={'/tramites'}
        />

        <CardsOptions
          icono={faMoneyBill} action={"Informes de pago del personal"} widhtFont={90} enlace={'/pagosEmp'}
        />
      </div>

      <div>
        <Footer/>
      </div>

    </div>

    
  );
}