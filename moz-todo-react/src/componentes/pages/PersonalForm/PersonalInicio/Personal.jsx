import React,{ useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuHome } from "react-icons/lu";
import { ImExit, ImIcoMoon } from "react-icons/im";
import { FaFilter } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import FilaPersonal from "../../../Molecules/FilaPersonal/FilaPersonal";
import FilaProfesor from "../../../Molecules/FilaProfesores/FilaProfesor";
import { LogInfoContext } from "../../../../LogInfo";
import Swal from 'sweetalert2'
import './Personal.css';
import HeaderPaginas from "../../../Molecules/HeaderPaginas/HeaderPaginas";
import BotonExit from "../../../Atoms/BotonExit/BotonExit";
import BotonInicio from "../../../Atoms/BotonInicio/BotonInicio";

//El header, al componerse de elementos simples, es una molécula, y por otro lado, tanto la barra de
//búsqueda y filtro y la tabla son parte de la plantilla, siendo la barra y la tabla dos organismos
//Y las filas de la tabla moleculas, las ventanas modales son organismos también
export default function Personal (){
    const [dataPer, setDataPer] = useState([]);
    const [dataProf, setDataProf] = useState([]);
    const [error, setError] = useState(null); //Indica error al obtener recursos
    const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
    const navigate = useNavigate();
    
    const operacionDeImpresion = () => {

        setDataPer([]);
        setDataProf([]);
    
        //Obtiene objeto del elemento html, checa si tiene informacion, si la tiene, lo almacena en el objeto
        let searchName = document.getElementById("search-container-personalMaestro-inputSearchName").value;
    
        let searchApellidoP = document.getElementById("search-container-personalMaestro-inputSearchApellidoP").value;
    
        let searchApellidoM = document.getElementById("search-container-personalMaestro-inputSearchApellidoM").value;
    
        let searchEstatus = document.getElementById("search-container-personalMaestro-estatus").value;

        let searchArea = document.getElementById("search-container-personal-area").value;

        let searchCargo = document.getElementById("search-container-personal-cargo").value;

        let searchEspecialidad = document.getElementById("search-container-profesor-especialidad").value;

        if(searchEspecialidad || searchCargo == 1)
            operacionDeImpresionBusquedaYFiltroDeProfesores(searchName, searchApellidoP, searchApellidoM, searchEstatus, searchEspecialidad);

        else if(searchArea || searchCargo)
            operacionDeImpresionBusquedaYFiltroDeEmpleados(searchName, searchApellidoP, searchApellidoM, searchEstatus, searchArea, searchCargo);
        
        else{
            operacionDeImpresionBusquedaYFiltroDeEmpleados(searchName, searchApellidoP, searchApellidoM, searchEstatus, searchArea, searchCargo);
            operacionDeImpresionBusquedaYFiltroDeProfesores(searchName, searchApellidoP, searchApellidoM, searchEstatus, searchEspecialidad);
        }
        authentificateUser();
      }

    const operacionDeImpresionBusquedaYFiltroDeEmpleados = (buscarNombre, buscarApellidoP, buscarApellidoM, buscarEstatus, buscarArea, buscarCargo) => {
        const url = "https://saiemapi.integrador.xyz/empleados/searchPer";
        const token = localStorage.getItem('token');
        //Inicia objeto que va a mandar los datos a la API
        let data = {
            nombre_busqueda : "", 
            apellido_p_busqueda : "", 
            apellido_m_busqueda : "", 
            estatusFiltro : "", 
            cargoFiltro : "", 
            areaFiltro : ""
        };

        if (buscarNombre)
            data.nombre_busqueda = buscarNombre;

        if(buscarApellidoP)
            data.apellido_p_busqueda = buscarApellidoP;

        if(buscarApellidoM)
            data.apellido_m_busqueda = buscarApellidoM;

        if(buscarEstatus)
            data.estatusFiltro = buscarEstatus;

        if(buscarArea)
            data.areaFiltro = buscarArea;

        if(buscarCargo)
            data.cargoFiltro = buscarCargo;

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
            setDataPer(response);
        })
        .catch(error => {
            setError(error.message);
        });
    }  

    const operacionDeImpresionBusquedaYFiltroDeProfesores = (buscarNombre, buscarApellidoP, buscarApellidoM, buscarEstatus, buscarEspecialidad) => {
        const url = "https://saiemapi.integrador.xyz/empleados/searchPro";
        const token = localStorage.getItem('token');
        //Inicia objeto que va a mandar los datos a la API
        let data = {
            nombre_busqueda : "", 
            apellido_p_busqueda : "", 
            apellido_m_busqueda : "", 
            estatusFiltro : "", 
            especialidadFiltro : ""
        };

        if (buscarNombre)
            data.nombre_busqueda = buscarNombre;

        if(buscarApellidoP)
            data.apellido_p_busqueda = buscarApellidoP;

        if(buscarApellidoM)
            data.apellido_m_busqueda = buscarApellidoM;

        if(buscarEstatus)
            data.estatusFiltro = buscarEstatus;

        if(buscarEspecialidad)
            data.especialidadFiltro = buscarEspecialidad;

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
            throw new Error('Error al imprimir los empleados: ' + response.status);
          }
          return response.json();
        })
          //Si todo esta bien, recibe la respuesta
        .then(response => {
            setDataProf(response);
        })
        .catch(error => {
            setError(error.message);
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
        operacionDeImpresion();
    }, []);

    const tipoUsuario = localStorage.getItem('typeUser');
    if(tipoUsuario == "employe"){
        return(
        <div>
            <div>
            <div>   
                <HeaderPaginas title={"Empleados y Maestros"}/>
                <BotonExit/>
                <BotonInicio/>
            </div>
        
            </div>

        <div className='search-container-personal'>
            <input type="search-A" placeholder='Nombre' id='search-container-personalMaestro-inputSearchName'/>
            <input type="search-A" placeholder='Apell. Pat.' id='search-container-personalMaestro-inputSearchApellidoP'/>
            <input type='search-A' placeholder='Apell. Mat.' id='search-container-personalMaestro-inputSearchApellidoM'/>
            <button className='search-container-personalMaestro-aplicarBusqueda' onClick={operacionDeImpresion}><IoSearchSharp /></button>
        </div>

        <div className='search-container-personal'>
            <select id="search-container-personal-area">
                <option value="">Seleccionar Area</option>
                <option value={1}>Dirección General</option>
                <option value={2}>Dirección Administrativa</option>
                <option value={3}>Dirección Académica</option>
                <option value={4}>Dirección de Orientación Vocacional</option>
                <option value={5}>Apoyo Contable y Administrativo</option>
                <option value={6}>Cafetería</option>
                <option value={7}>Limpieza y Servicios</option>
            </select>
            <select id="search-container-personal-cargo">
                <option value="">Seleccionar Cargo</option>
                <option value={1}>Docente</option>
                <option value={2}>Coordinador</option>
                <option value={3}>Administrativo</option>
                <option value={4}>Directivo</option>
                <option value={5}>Contador</option>
            </select>
            <select id="search-container-profesor-especialidad">
                <option value="">Seleccionar especialidad</option>
                <option value={1}>Ciencias: Físico-Matemático</option>
                <option value={2}>Ciencias: Químico-Biológicas</option>
                <option value={3}>Ciencias Sociales y Humanidades</option>
                <option value={4}>Lengua y Comunicación</option>
            </select>
            <select id='search-container-personalMaestro-estatus'>
                <option id='status' value="">Seleccionar status</option>
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
                <option value={3}>Dado de baja</option>
            </select>
            <button id='filter' onClick={operacionDeImpresion}><FaFilter /></button>
        </div>

        <div className='table-Alumnos'>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apell. Pat.</th>
                        <th>Apell. Mat.</th>
                        <th>Cargo</th>
                        <th>Área / Especialidad</th>
                        <th>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {//Imprime los datos del recurso obtenido, por for each
                        dataPer.length > 0 ? (
                        dataPer.map((recursoPer) => (//Falta poner el componente de la fila de personal
                        <FilaPersonal key={recursoPer.id} perId={recursoPer.id} perNombre={recursoPer.nombre} perApellidoP={recursoPer.apellido_p} perApellidoM={recursoPer.apellido_m} perArea={recursoPer.nombre_area} perCargo={recursoPer.nombre_cargo} perEstatus={recursoPer.tipo_estatus} autentificar={authentificateUser}/>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="8">No hay datos de los empleados</td>
                    </tr>
                    )}
                    {//Imprime los datos del recurso obtenido, por for each
                        dataProf.length > 0 ? (
                        dataProf.map((recursoProf) => (//Falta poner el componente de la fila de personal
                        <FilaProfesor key={recursoProf.id} proId={recursoProf.id} proNombre={recursoProf.nombre} proApellioP={recursoProf.apellido_p} proApellidoM={recursoProf.apellido_m} proEspecialidad={recursoProf.nombre_especialidad} proEstatus={recursoProf.tipo_estatus} autentificar={authentificateUser}/>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="8">No hay datos de los profesores</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
        </div>
        );
    }

    return(
        <div>
            <div>   
                <HeaderPaginas title={"Empleados y Maestros"}/>
                <BotonExit/>
                <BotonInicio/>

        
            </div>

        <div className='search-container-personal'>
            <input type="search-A" placeholder='Nombre' id='search-container-personalMaestro-inputSearchName'/>
            <input type="search-A" placeholder='Apell. Pat.' id='search-container-personalMaestro-inputSearchApellidoP'/>
            <input type='search-A' placeholder='Apell. Mat.' id='search-container-personalMaestro-inputSearchApellidoM'/>
            <button className='search-container-personalMaestro-aplicarBusqueda' onClick={operacionDeImpresion}><IoSearchSharp /></button>

            <Link to={'/addEmpleado'}>
                <button className='add-personal'><IoMdPersonAdd/>Añadir personal</button>
            </Link>
            <Link to={'/addMaestro'}>
                <button className="add-personal"><IoMdPersonAdd/>Añadir maestro</button>
            </Link>
        </div>

        <div className='search-container-personal'>
            <select id="search-container-personal-area">
                <option value="">Seleccionar Area</option>
                <option value={1}>Dirección General</option>
                <option value={2}>Dirección Administrativa</option>
                <option value={3}>Dirección Académica</option>
                <option value={4}>Dirección de Orientación Vocacional</option>
                <option value={5}>Apoyo Contable y Administrativo</option>
                <option value={6}>Cafetería</option>
                <option value={7}>Limpieza y Servicios</option>
            </select>
            <select id="search-container-personal-cargo">
                <option value="">Seleccionar Cargo</option>
                <option value={1}>Docente</option>
                <option value={2}>Coordinador</option>
                <option value={3}>Administrativo</option>
                <option value={4}>Directivo</option>
                <option value={5}>Contador</option>
            </select>
            <select id="search-container-profesor-especialidad">
                <option value="">Seleccionar especialidad</option>
                <option value={1}>Ciencias: Físico-Matemático</option>
                <option value={2}>Ciencias: Químico-Biológicas</option>
                <option value={3}>Ciencias Sociales y Humanidades</option>
                <option value={4}>Lengua y Comunicación</option>
            </select>
            <select id='search-container-personalMaestro-estatus'>
                <option id='status' value="">Seleccionar status</option>
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
                <option value={3}>Dado de baja</option>
            </select>
            <button id='filter' onClick={operacionDeImpresion}><FaFilter /></button>
        </div>

        <div className='table-Alumnos'>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apell. Pat.</th>
                        <th>Apell. Mat.</th>
                        <th>Cargo</th>
                        <th>Área / Especialidad</th>
                        <th>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {//Imprime los datos del recurso obtenido, por for each
                        dataPer.length > 0 ? (
                        dataPer.map((recursoPer) => (//Falta poner el componente de la fila de personal
                        <FilaPersonal key={recursoPer.id} perId={recursoPer.id} perNombre={recursoPer.nombre} perApellidoP={recursoPer.apellido_p} perApellidoM={recursoPer.apellido_m} perArea={recursoPer.nombre_area} perCargo={recursoPer.nombre_cargo} perEstatus={recursoPer.tipo_estatus} autentificar={authentificateUser}/>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="8">No hay datos de los empleados</td>
                    </tr>
                    )}
                    {//Imprime los datos del recurso obtenido, por for each
                        dataProf.length > 0 ? (
                        dataProf.map((recursoProf) => (//Falta poner el componente de la fila de personal
                        <FilaProfesor key={recursoProf.id} proId={recursoProf.id} proNombre={recursoProf.nombre} proApellioP={recursoProf.apellido_p} proApellidoM={recursoProf.apellido_m} proEspecialidad={recursoProf.nombre_especialidad} proEstatus={recursoProf.tipo_estatus} autentificar={authentificateUser}/>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="8">No hay datos de los profesores</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    );
}