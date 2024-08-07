import React, { useEffect, useState, useContext } from 'react';
import { LuHome } from "react-icons/lu";
import { ImExit, ImIcoMoon } from "react-icons/im";
import FilaTram from '../../../Molecules/filasTramites/FilaTram';
import { MdNoteAdd } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { LogInfoContext } from '../../../../LogInfo';
import Swal from 'sweetalert2';
import './Tramites.css';
import HeaderPaginas from '../../../Molecules/HeaderPaginas/HeaderPaginas';
import BotonExit from '../../../Atoms/BotonExit/BotonExit';
import BotonInicio from '../../../Atoms/BotonInicio/BotonInicio';
import { useNavigate } from 'react-router-dom';

//El header, al componerse de elementos simples, es una molécula, y por otro lado, tanto la barra de
//búsqueda y filtro y la tabla son parte de la plantilla, siendo la barra y la tabla dos organismos
//Y las filas de la tabla moleculas
export default function Tramites() {
  const navigate = useNavigate();
  
  const [recursos, setRecursos] = useState([]); //Necesario para obtener recursos
  const [error, setError] = useState(null); //Indica error al obtener recursos
  const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);

  const operacionDeImpresionBusquedaYFiltro = () => {
    const url = "https://saiemapi.integrador.xyz/tramites/search";
    const token = localStorage.getItem('token');
    let data = {
      folio_busqueda: "",
      concepto_busqueda: "",
      nombreBusqueda: "",
      apellido_p_busqueda: "",
      apellido_m_busqueda: "",
      fechaDeCorteFiltro: "",
      estatusFiltro: "",
      gradoFiltro: "",
      grupoFiltro: ""
    };

    let searchFolio = document.getElementById("search-container-tramites-inputSearchFolio").value;
    if (searchFolio) 
      data.folio_busqueda = parseInt(searchFolio);

    let searchConcepto = document.getElementById("search-container-tramites-inputSearchConcepto").value;
    if (searchConcepto) 
      data.concepto_busqueda = searchConcepto;

    let searchNombre = document.getElementById("search-container-pagos-inputSearchNombre").value;
    if (searchNombre) 
      data.nombreBusqueda = searchNombre;

    let SearchApellidoP = document.getElementById("search-container-pagos-inputSearchApellidoP").value;
    if (SearchApellidoP) 
      data.apellido_p_busqueda = SearchApellidoP;

    let SearchApellidoM = document.getElementById("search-container-pagos-inputSearchApellidoM").value;
    if (SearchApellidoM) 
      data.apellido_m_busqueda = SearchApellidoM;

    let searchFecha = document.getElementById("search-container-tramites-inputSearchFecha").value;
    if (searchFecha){
      data.fechaDeCorteFiltro = searchFecha;
    } 

    let searchEstatus = document.getElementById("search-container-pagos-estatus").value;
    if (searchEstatus) 
      data.estatusFiltro = searchEstatus;

    let SearchGrado = document.getElementById("search-container-pagos-inputSearchGrade").value;
    if (SearchGrado) 
      data.gradoFiltro = SearchGrado;

    let SearchGrupo = document.getElementById("search-container-pagos-inputSearchGroup").value;
    if (SearchGrupo) 
      data.grupoFiltro = SearchGrupo;

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
     })
    .then(response => {
      if(!response.ok){
        throw new Error('Error al imprimir los trámites: ' + response.status);
      }
      return response.json();
    })
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

  //Al cargar la page, ejecuta la funcion
  useEffect(()=>{
    authentificateUser();
  }, []);


  useEffect(()=>{
    operacionDeImpresionBusquedaYFiltro();
  }, []);

  return (
    <div>
      <div >

        <HeaderPaginas title={"Tramites"}/>
        <BotonExit/>
        <BotonInicio/>

      </div>

      <div className='search-container-pagos'>
        <input type="search-A" placeholder='Folio' id='search-container-tramites-inputSearchFolio'/>
        <input type="search-A" placeholder='Concepto' id='search-container-tramites-inputSearchConcepto'/>
        <input type='search-A' placeholder='Nombre' id='search-container-pagos-inputSearchNombre'/>
        <input type='search-A' placeholder='Ape. P.' id='search-container-pagos-inputSearchApellidoP'/>
        <input type="search-A" placeholder='Ape. M' id='search-container-pagos-inputSearchApellidoM'/>
        <input type="date" id='search-container-tramites-inputSearchFecha'/>

        <button id='search-container-pagos-aplicarBusqueda' onClick={operacionDeImpresionBusquedaYFiltro}><IoSearchSharp /></button>

        <a href={'/addTra'}>
          <button className='add-pago'>< MdNoteAdd /></button>
        </a>
      </div>

      <div className='search-container-pagos'>
        <input type='search-A' placeholder='Grado' id='search-container-pagos-inputSearchGrade'/>
        <input type='search-A' placeholder='Grupo' id='search-container-pagos-inputSearchGroup' maxLength={1}/>
        <select id='search-container-pagos-estatus'>
          <option id='status-pago' value="">Seleccionar estatus</option>
          <option value={1}>Pendiente</option>
          <option value={2}>Por pagar</option>
          <option value={3}>Pagado</option>
          <option value={4}>Atrasado</option>
        </select>
        <button id='filter-pago' onClick={operacionDeImpresionBusquedaYFiltro}><FaFilter /></button>
      </div>

      <div className='table-tramites'>
        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Solicitante del trámite</th>
              <th>Grado</th>
              <th>Grupo</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Fecha de corte</th>
              <th>Estatus del pago</th>
            </tr>
          </thead>
          <tbody>
            {recursos.length > 0 ? (
              recursos.map((recurso) => (
              <FilaTram key={recurso.id} idT={recurso.id} folioT={recurso.folio} nombreAlm={recurso.nombre} 
                apellidoP={recurso.apellido_p} apellidoM={recurso.apellido_m} gradoAlm={recurso.grado}
                grupoAlm={recurso.grupo} conceptoT={recurso.concepto} montoT={recurso.monto}
                fechaDeCorteT={recurso.fechaDeCorte} estatusTramiteT={recurso.tipo_estatus}
                actualizarLista={operacionDeImpresionBusquedaYFiltro} autentificar={authentificateUser}
              />
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
