import React, { useState, useContext } from 'react';
import './Login.css';
import { CiUser, CiLock } from 'react-icons/ci';
import LOGO from './AssetsLogin/LOGO.jpg';
import { useNavigate } from 'react-router-dom';
import { LogInfoContext } from '../../../LogInfo';
import Swal from 'sweetalert2'

//Los inputs y botones son átomos a parte, así como el logo y el título, y la unión de estos dos hace una
//molécula, y la unión de todos estos forma la plantilla de la página
export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);

  const iniciarSesion = async () => {
    const url = `https://saiemapi.integrador.xyz/usersJWT/login`;

    let username = document.getElementById('inputUsername').value;
    let password = document.getElementById('inputPassword').value;

    let userLog = {
      nombre: username,
      password: password,
    };

    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userLog),
      });

      if (!respuesta.ok) {
        // Mostrar un mensaje de error usando SweetAlert si la respuesta no es exitosa
        const errorMessage = await respuesta.text(); // Obtener el mensaje de error del cuerpo de la respuesta
        Swal.fire({
          title: 'Error',
          text: 'Error en la autenticación, ingrese un usuario y contraseña válidos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return; // Detener la ejecución si hay un error
      }

      const data = await respuesta.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('idUser', data.idUser);
      localStorage.setItem('typeUser', data.tipoUser);

      setIsLoggedIn(true);

      navigate('/inicio');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error inesperado. Inténtalo de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      console.error('Error al configurar la solicitud:', error.message);
    }
  };

  return (
    <div className='wrapper'>
      <div>
        <img src={LOGO} alt='Left' className='header-image' />
      </div>
      <h1>Bienvenido</h1>
      <h2>Ingrese el nombre de usuario y su contraseña</h2>
      <div className='input-box'>
        <input type='text' placeholder='Nombre de Usuario' required id='inputUsername' />
        <CiUser className='icon' />
      </div>
      <div className='input-box'>
        <input type='password' placeholder='Contraseña' required id='inputPassword' />
        <CiLock className='icon' />
      </div>

      <button onClick={iniciarSesion}>Iniciar Sesion</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}