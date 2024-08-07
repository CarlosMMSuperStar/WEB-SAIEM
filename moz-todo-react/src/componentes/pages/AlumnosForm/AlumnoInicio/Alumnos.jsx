import React, { useEffect, useState, useContext } from 'react';
import { IoMdPersonAdd } from "react-icons/io";

import FilaDate from '../../../Molecules/filasAlumnos/FilaDate';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilter } from "react-icons/fa";
import './Alumnos.css';
import { IoSearchSharp } from "react-icons/io5";
import { LogInfoContext } from '../../../../LogInfo';
import HeaderPaginas from '../../../Molecules/HeaderPaginas/HeaderPaginas';
import BotonExit from '../../../Atoms/BotonExit/BotonExit';
import BotonInicio from '../../../Atoms/BotonInicio/BotonInicio';

//El header, al componerse de elementos simples, es una molécula, y por otro lado, tanto la barra de
//búsqueda y filtro y la tabla son parte de la plantilla, siendo la barra y la tabla dos organismos
//Y las filas de la tabla moleculas, las ventanas modales son organismos también
export default function Alumnos() {
  const [data, setData] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
  const [recursos, setRecursos] = useState([]); //Necesario para obtener recursos
  const [error, setError] = useState(null); //Indica error al obtener recursos
  const navigate = useNavigate();

  //Funcion que imprime los datos de los alumnos en la tabla
  const operacionDeImpresionBusquedaYFiltro = () => {
    const url = "https://saiemapi.integrador.xyz/alumnos/searchAlumnos";
    const token = localStorage.getItem('token');
    //Inicia objeto que va a mandar los datos a la API
    let data = {
      nombre_busqueda: "",
      apellido_p_busqueda: "",
      apellido_m_busqueda: "",
      noControlBusqueda: "",
      gradoFiltro: "",
      grupoFiltro: "",
      estatusFiltro: ""
    };

    //Obtiene objeto del elemento html, checa si tiene informacion, si la tiene, lo almacena en el objeto
    let searchName = document.getElementById("search-container-alumnos-inputSearchName").value;
    if (searchName) 
      data.nombre_busqueda = searchName;

    let searchApellidoP = document.getElementById("search-container-alumnos-inputSearchApellidoP").value;
    if (searchApellidoP) 
      data.apellido_p_busqueda = searchApellidoP;

    let searchApellidoM = document.getElementById("search-container-alumnos-inputSearchApellidoM").value;
    if (searchApellidoM) 
      data.apellido_m_busqueda = searchApellidoM;

    let searchNoControl = document.getElementById("search-container-alumnos-inputSearchNoControl").value;
    if (searchNoControl) 
      data.noControlBusqueda = parseInt(searchNoControl);

    let searchGrade = document.getElementById("search-container-alumnos-inputSearchGrade").value;
    if (searchGrade) 
      data.gradoFiltro = parseInt(searchGrade);

    let searchGroup = document.getElementById("search-container-alumnos-inputSearchGroup").value;
    if (searchGroup) 
      data.grupoFiltro = searchGroup;

    let searchEstatus = document.getElementById("search-container-alumnos-estatus").value;
    if (searchEstatus) 
      data.estatusFiltro = searchEstatus;

    //Envia la consulta a la API
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
    //Si hay error, imprime esto
    .then(response => {
      if(!response.ok){
        throw new Error('Error al imprimir los alumnos: ' + response.status);
      }
      return response.json();
    })
    //Si todo esta bien, recibe la respuesta
    .then(response => {
      setRecursos(response);
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
  }

  useEffect(()=>{
    authentificateUser();
  },[])

  //Al cargar la page, ejecuta la funcion
  useEffect(()=>{
    operacionDeImpresionBusquedaYFiltro();
  }, []);

  return (
    <div>
      <div>
        <HeaderPaginas title={"Alumnos"}/>
        <BotonExit/>
        <BotonInicio/>


        
      </div>

      <div className='search-container-alumnos'>
        <input type="search-A" placeholder='Nombre' id='search-container-alumnos-inputSearchName' maxLength={45}/>
        <input type="search-A" placeholder='Apell. Pat.' id='search-container-alumnos-inputSearchApellidoP' maxLength={45}/>
        <input type='search-A' placeholder='Apell. Mat.' id='search-container-alumnos-inputSearchApellidoM' maxLength={45}/>
        <input type='search-A' placeholder='No. Control.' id='search-container-alumnos-inputSearchNoControl' maxLength={10}/>
        <button className='search-container-alumnos-aplicarBusqueda' onClick={operacionDeImpresionBusquedaYFiltro}><IoSearchSharp /></button>

        <a href={'/agg'}>
          <button className='add-Alumno'><IoMdPersonAdd /></button>
        </a>
      </div>

      <div className='search-container-alumnos'>
        <input type='search-A' placeholder='Grado' id='search-container-alumnos-inputSearchGrade'/>
        <input type='search-A' placeholder='Grupo' id='search-container-alumnos-inputSearchGroup' maxLength={1}/>
        <select id='search-container-alumnos-estatus'>
          <option id='status' value="">Seleccionar status</option>
          <option value={1}>Activo</option>
          <option value={2}>Inactivo</option>
          <option value={3}>Dado de baja</option>
          <option value={4}>Egresado</option>
        </select>
        <button id='filter' onClick={operacionDeImpresionBusquedaYFiltro}><FaFilter /></button>
      </div>

      <div className='table-Alumnos'>
        <table>
          <thead>
            <tr>
              <th>No. Control</th>
              <th>Nombre</th>
              <th>Apell. Pat.</th>
              <th>Apell. Mat.</th>
              <th>Grado</th>
              <th>Grupo</th>
              <th>Turno</th>
              <th>Estatus</th>
              
            </tr>
          </thead>
          <tbody>
            {//Imprime los datos del recurso obtenido, por for each
              recursos.length > 0 ? (
              recursos.map((recurso) => (
                <FilaDate key={recurso.id} idAlumno={recurso.id} noControlAlumno={recurso.noControl} nombreAlumno={recurso.nombre} apellidoPAlumno={recurso.apellido_p} apellidoMAlumno={recurso.apellido_m} gradoAlumno={recurso.grado} grupoAlumno={recurso.grupo} turnoAlumno={recurso.turno} estatusAlumno={recurso.tipo_estatus} autenticar={authentificateUser} />
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
