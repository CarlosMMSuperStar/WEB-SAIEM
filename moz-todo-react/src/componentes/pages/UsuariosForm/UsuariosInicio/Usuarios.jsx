import React, { useState, useEffect, useContext } from 'react';
import { IoMdPersonAdd } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { LuHome } from "react-icons/lu";
import { ImExit } from "react-icons/im";
import { FaUserPlus } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import FilaUsuarios from '../../../Molecules/FilaUsuarios/FilaUsuarios';
import Swal from 'sweetalert2';
import { LogInfoContext } from '../../../../LogInfo';
import './Usuarios.css';
import HeaderPaginas from '../../../Molecules/HeaderPaginas/HeaderPaginas';
import BotonExit from '../../../Atoms/BotonExit/BotonExit';
import BotonInicio from '../../../Atoms/BotonInicio/BotonInicio';
import Footer from '../../../cells/Footer/Footer';

//El header, al componerse de elementos simples, es una molécula, y por otro lado, tanto la barra de
//búsqueda y filtro y la tabla son parte de la plantilla, siendo la barra y la tabla dos organismos
//Y las filas de la tabla moleculas
const Usuarios = () => {
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
  const navigate = useNavigate();

  const imprimirUsuarios = () => {
    const url = `https://saiemapi.integrador.xyz/usersJWT/`;
    const token = localStorage.getItem('token');

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Error al imprimir los alumnos: ' + response.status);
      }
      return response.json();
    })
    //Si todo esta bien, recibe la respuesta
    .then(response => {
      setUsers(response);
    })
    .catch(error => {
      setError(error.message);
      authentificateUser();
    });
  }

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
        localStorage.removeItem('typeUser')
        navigate('/')
        return;
      }
    }
    const tipoUsuario = localStorage.getItem('typeUser');
    if(tipoUsuario == "employe"){
        Swal.fire({
            title: 'Error',
            text: 'Ups, usted no tiene permitido estar aquí',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
        setTimeout(() => {
            navigate('/inicio');
        }, 1000);
    }
  }

  //Al cargar la page, ejecuta la funcion
  useEffect(()=>{
    authentificateUser();
  }, []);


  useEffect(()=>{
    imprimirUsuarios();
  }, []);

  return (
    <div>
      <div>
        <HeaderPaginas title={"Usuarios"}/>
        <BotonExit/>
        <BotonInicio/>
      </div>

      <div >
        <Link to={"/aggUsers"}>
          <button className='add-user'><FaUserPlus/></button>
        </Link>

      </div>

      <div className='table'>      
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Usuario</th>
              <th>Tipo de Usuario</th>
              <th>Área del Usuario</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <FilaUsuarios key={item.id} data={item} actualizar={imprimirUsuarios} autentificar={authentificateUser}/>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default Usuarios;