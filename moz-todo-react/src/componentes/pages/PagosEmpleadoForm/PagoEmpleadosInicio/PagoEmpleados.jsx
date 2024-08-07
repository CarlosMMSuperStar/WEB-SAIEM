import React, { useEffect, useState, useContext } from 'react';

import { MdNoteAdd } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import FilasPagosEmp from '../../../Molecules/FilasPagos/FilasPagosEmp';
import Swal from 'sweetalert2';
import { LogInfoContext } from '../../../../LogInfo';
import { Link, useNavigate } from 'react-router-dom';
import HeaderPaginas from '../../../Molecules/HeaderPaginas/HeaderPaginas';
import BotonExit from '../../../Atoms/BotonExit/BotonExit';
import BotonInicio from '../../../Atoms/BotonInicio/BotonInicio';
import './PagoEmpleados.css'

//El header, al componerse de elementos simples, es una molécula, y por otro lado, tanto la barra de
//búsqueda y filtro y la tabla son parte de la plantilla, siendo la barra y la tabla dos organismos
//Y las filas de la tabla moleculas
export default function PagoEmpleados() {
  const [pagEmp, setPagEmp] = useState([]); //Necesario para obtener recursos
  const [pagPro, setPagPro] = useState([]);
  const [error, setError] = useState(null); //Indica error al obtener recursos
  const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
  const navigate = useNavigate();

  const buscarOFiltrar = () => {
    //busqueda solo del personal
    const url1 = "https://saiemapi.integrador.xyz/PagoEmp/searchP";
    const url2 = "https://saiemapi.integrador.xyz/PagoEmp/searchPro";
    const token = localStorage.getItem('token');
    
    let data1 = {
        nombreB:"",
        apellido_pB:"",
        apellido_mB:"",
        fechaPagoB:"",
        estatusF:""
    };

    let data2 = {
        nombreB:"",
        apellido_pB:"",
        apellido_mB:"",
        fechaPagoB:"",
        estatusF:""
    }

    let searchNombre = document.getElementById("search-container-pagos-inputSearchNombre").value;
    if (searchNombre) {
      data1.nombreB = searchNombre;
      data2.nombreB = searchNombre;
    }

    let SearchApellidoP = document.getElementById("search-container-pagos-inputSearchApellidoP").value;
    if (SearchApellidoP) {
      data1.apellido_pB = SearchApellidoP;
      data2.apellido_pB = SearchApellidoP;
    }

    let SearchApellidoM = document.getElementById("search-container-pagos-inputSearchApellidoM").value;
    if (SearchApellidoM) {
      data1.apellido_mB = SearchApellidoM;
      data2.apellido_mB = SearchApellidoM;
    }

    let searchFecha = document.getElementById("search-container-tramites-inputSearchFecha").value;
    if (searchFecha){
      data1.fechaPagoB = searchFecha;
      data2.fechaPagoB = searchFecha;
    } 
    let searchEstatus = document.getElementById("search-container-pagos-estatus").value;
    if (searchEstatus) {
      data1.estatusF = searchEstatus;
      data2.estatusF = searchEstatus;
    }
;

    fetch(url1, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data1)
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Error al imprimir los pagos: ' + response.status);
      }
      return response.json();
    })
    .then(response => {
      setPagEmp(response);
    })
    .catch(error => {
      setError(error.message);
      authentificateUser();
    });

    fetch(url2, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data2)
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Error al imprimir los pagos: ' + response.status);
      }
      return response.json();
    })
    .then(response => {
      setPagPro(response);
    })
    .catch(error => {
      setError(error.message);
      authentificateUser();
    });
  }

  useEffect(()=>{
    buscarOFiltrar();
  }, []);

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


  return (
    <div>
      <div>

        <HeaderPaginas title={"Pago de Empleados"}/>
        <BotonExit/>
        <BotonInicio/>

      </div>

      <div className='search-container-pagos-empleados'>
        <input type='search-A' placeholder='Nombre' id='search-container-pagos-inputSearchNombre'/>
        <input type='search-A' placeholder='Ape. P.' id='search-container-pagos-inputSearchApellidoP'/>
        <input type="search-A" placeholder='Ape. M' id='search-container-pagos-inputSearchApellidoM'/>
        <input type="date" id='search-container-tramites-inputSearchFecha'/>

        <button id='search-container-pagos-aplicarBusqueda' onClick={buscarOFiltrar}><IoSearchSharp /></button>

        <a href={'/addPer'}>
          <button className='add-pago-empleados'>Pago_Empleado< MdNoteAdd /></button>
        </a>
        <a href={'/addPro'}>
          <button className='add-pago-empleados'>Pago_Maestro< MdNoteAdd /></button>
        </a>
      </div>

      <div className='search-container-pagos-empleados'>
        <select id='search-container-pagos-estatus'>
          <option id='status-pago' value="">Seleccionar estatus</option>
          <option value={1}>Pendiente</option>
          <option value={2}>Por pagar</option>
          <option value={3}>Pagado</option>
          <option value={4}>Atrasado</option>
        </select>
        <button id='filter-pago' onClick={buscarOFiltrar}><FaFilter /></button>
      </div>

      <div className='table-tramites-empleados'>
        <table>
          <thead>
            <tr> 
                <th>Empleado</th>
                <th>Cargo</th>
                <th>Horas trabajadas</th>
                <th>Total a pagar</th>
                <th>Fecha de pago</th>
                <th>Estatus del pago</th>
            </tr>
          </thead>
          <tbody>
            {pagEmp.length > 0 ? (
              pagEmp.map((recurso) => (
              <FilasPagosEmp key={recurso.id} idP={recurso.id} nombreEmp={recurso.nombre} apellidoP={recurso.apellido_p} apellidoM={recurso.apellido_m} carg={recurso.nombre_cargo} horasTra={recurso.horasTrabajadas} totalPago={recurso.totalPago}  fechaDeCorte={recurso.fechaPago} estatusTramite={recurso.tipo_estatus} actualizarLista={buscarOFiltrar} autentificar={authentificateUser}/>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay datos de pgos de empleados</td>
              </tr>
            )}
            {pagPro.length > 0 ? (
              pagPro.map((recurso) => (
                <FilasPagosEmp key={recurso.id} idP={recurso.id} nombreEmp={recurso.nombre} apellidoP={recurso.apellido_p} apellidoM={recurso.apellido_m} carg={"Docente"} horasTra={recurso.horasTrabajadas} totalPago={recurso.totalPago}  fechaDeCorte={recurso.fechaPago} estatusTramite={recurso.tipo_estatus} actualizarLista={buscarOFiltrar} autentificar={authentificateUser}/>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay datos de pago de maestros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
