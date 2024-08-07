import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import Logo2 from './AssetsDAlumn/Logo2.png';
import Swal from 'sweetalert2';
import './EditAlum.css';
import { useState, useContext, useEffect } from 'react';
import { LogInfoContext } from '../../../../LogInfo';
import HeaderSubP from '../../../Molecules/HeaderSubP/HeaderSubP';
import BotonReturn from '../../../Atoms/BotonReturn/BotonReturn';
import Footer from '../../../cells/Footer/Footer';
//Por un lado, el header o cabecera es una molécula, por su nivel de complejidad, y por el otro,
//El formulario, es una plantilla, los botones de guardar y cancelar son dos átomos en sí mismos,
//Y juntos conforman una molécula, y el conjunto de inputs conformar el ser vivo
export default function EditAlum() {
  const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
  const [coincidencias, setCoincidencias] = useState([]); //Necesario para obtener recursos
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  if (!data) {
    setTimeout(() => {
      navigate('/alumnos');
    }, 1000);
    return <div>No data available</div>;
  } else
  console.log(data.id)

  const handleSaveClick = () => {
    Swal.fire({
        title: "¿Desea guardar los cambios?",
        showCancelButton: true,
        confirmButtonText: "Guardar",
    }).then((result) => {
        if (result.isConfirmed) {
            mandarCambiosALaBaseDeDatos();
        }
    });
  };

  const handleCancelClick = () => {
    Swal.fire({
      title: "Cancelar Edición ¿?",
      text: "Se borraran los datos ingresados",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Si, Cancelar Edición",
      cancelButtonText: "Seguir Editando",
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
            navigate('/alumnos');
        }, 1000);
      }
    })

  };

  const comprobarSiEsNumero = (cadenaAAnalizar) => {
      var valoresAceptados = /^[0-9]+$/;
      if (valoresAceptados.test(cadenaAAnalizar)){
          console.log(cadenaAAnalizar + " es un valor valido")
          return true;
      } else {
          console.log(cadenaAAnalizar + " no es un valor valido")
          return false;
      }
  }

  const comprobarSiHayDatosRepetidos = async (analizarNoControl, analizarCurp) => {
      const token = localStorage.getItem('token');
      const url = `https://saiemapi.integrador.xyz/alumnos/comprobarAlumnos`;

      const datoACoincidir = {
          noControl: analizarNoControl,
          curp: analizarCurp
      };

      try {
          const response = await fetch(url, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(datoACoincidir)
          });

          if (!response.ok) {
              throw new Error('Error al buscar coincidencias: ' + response.status);
          }

          const data = await response.json();
          setCoincidencias(data);

          if (data.length > 0) {
              console.log("Hay coincidencias: " + data);
              return true;
          } else {
              console.log("No hay coincidencias");
              return false;
          }
      } catch (error) {
          console.log("Error: " + error);
          return false;
      }
  };

  const mandarCambiosALaBaseDeDatos = async () => {
      const url = `https://saiemapi.integrador.xyz/alumnos/update/${data.id}`;
      const token = localStorage.getItem('token');
      let dato = {
        nombre: "", 
        apellido_p: "", 
        apellido_m: "", 
        grado: "", 
        grupo: "", 
        turno: "", 
        noControl: "", 
        estado: "", 
        curp: "", 
        telefono: "", 
        correo: "", 
        nombre_tutor: "", 
        apellido_p_tutor: "", 
        apellido_m_tutor: "", 
        telefono_tutor: "", 
        nivelAcademico: "", 
        escuelaProcedente: "", 
        colegioAspirado: "", 
        carreraAspirada: "", 
        fechaInicioCurso: "", 
        fechaExamenDiagnostico: "", 
        nivelMatematico: "", 
        nivelAnalitico: "", 
        nivelLinguistico: "", 
        nivelComprension: "", 
        nivelGeneral: ""
    };

    let registrarNombre = document.getElementById("inputNombre").value;
    let registrarApellidoP = document.getElementById("inputApellidoP").value;
    let registrarApellidoM = document.getElementById("inputApellidoM").value;
    let registrarGrado = document.getElementById("inputGrado").value;
    let registrarGrupo = document.getElementById("inputGrupo").value;
    let registrarTurno = document.getElementById("inputTurno").value;
    let registrarNoControl = document.getElementById("inputNoControl").value;
    let registrarEstado = document.getElementById("inputEstatus").value;
    let registrarCurp = document.getElementById("inputCurp").value;
    let registrarTelefono = document.getElementById("inputTelefono").value;
    let registrarCorreo = document.getElementById("inputCorreo").value;
    let registrarNombreTutor = document.getElementById("inputNombreTutor").value;
    let registrarApellidoPTutor = document.getElementById("inputApellidoPTutor").value;
    let registrarApellidoMTutor = document.getElementById("inputApellidoMTutor").value;
    let registrarTelefonoTutor = document.getElementById("inputTelefonoTutor").value;
    let registrarlvlAcademico = document.getElementById("inputlvlAcademic").value;
    let registrarSchoolProcedente = document.getElementById("inputColegioProveniente").value;
    let registrarUniAspirada = document.getElementById("inputUniversidadAspira").value;
    let registrarCarreraAspirada = document.getElementById("inputCarreraAspira").value;
    let registrarFechaCurso = document.getElementById("inputFechaCurso").value;
    let registrarFechaExamen = document.getElementById("inputFechaExamen").value;
    let registrarlvlMatematic = document.getElementById("inputMatScore").value;
    let registrarlvlAnalitic = document.getElementById("inputAnalitScore").value;
    let registrarlvlLang = document.getElementById("inputLangScore").value;
    let registrarlvlCompren = document.getElementById("inputLectScore").value;
    let registrarlvlGeneral = document.getElementById("inputGenScore").value;

    if (registrarTurno == 0 || registrarEstado == 0) {
        console.log("No olvide elegir el turno y estatus");
        Swal.fire({
          title: "Error",
          text: "No olvide elegir el turno y estatus del alumno",
          icon: "error",
          timer: 1000
        });
        return false;
    } else if (await comprobarSiHayDatosRepetidos(registrarNoControl, registrarCurp)){
        Swal.fire({
          title: "Error",
          text: "Ya existen datos con el mismo número de control o CURP",
          icon: "error",
          timer: 1000
        });
        return false;
    } else {
        if(registrarNombre) dato.nombre = registrarNombre; else dato.nombre = data.nombre;
        if(registrarApellidoP) dato.apellido_p = registrarApellidoP; else dato.apellido_p = data.apellido_p;
        if(registrarApellidoM) dato.apellido_m = registrarApellidoM; else dato.apellido_m = data.apellido_m;
        if(registrarGrado){
          if(registrarGrado <= 0 || registrarGrado > 17){
            Swal.fire({
              title: "Error",
              text: "Ingrese un grado válido",
              icon: "error",
              timer: 1000
            });
            dato.grado = data.grado;
            return false;
          }
          else dato.grado = registrarGrado;
        } 
        else dato.grado = data.grado;
        if(registrarGrupo) dato.grupo = registrarGrupo; else dato.grupo = data.grupo;
        dato.turno = registrarTurno;
        if(registrarNoControl){
          if(comprobarSiEsNumero(registrarNoControl))
            dato.noControl = registrarNoControl;
          else{
            Swal.fire({
              title: "Error",
              text: "No. Control Inválido",
              icon: "error",
              timer: 1000
            });
            dato.noControl = data.noControl;
            return false;
          }
        } 
        else dato.noControl = data.noControl;
        dato.estado = registrarEstado;
        if(registrarCurp) dato.curp = registrarCurp; else dato.curp = data.curp;
        if(registrarTelefono){
          if(comprobarSiEsNumero(registrarTelefono))
            dato.telefono = registrarTelefono;
          else{
            Swal.fire({
              title: "Error",
              text: "No. de teléfono inválido",
              icon: "error",
              timer: 1000
            });
            dato.telefono = data.telefono;
            return false
          }
        } 
        else dato.telefono = data.telefono;
        if(registrarCorreo) dato.correo = registrarCorreo; else dato.correo = data.correo;
        if(registrarNombreTutor) dato.nombre_tutor = registrarNombreTutor; else dato.nombre_tutor = data.nombre_tutor;
        if(registrarApellidoPTutor) dato.apellido_p_tutor = registrarApellidoPTutor; else dato.apellido_p_tutor = data.apellidoP_tutor;
        if(registrarApellidoMTutor) dato.apellido_m_tutor = registrarApellidoMTutor; else dato.apellido_m_tutor = data.apellidoM_tutor;
        if(registrarTelefonoTutor){
          if(comprobarSiEsNumero(registrarTelefonoTutor))
            dato.telefono_tutor = registrarTelefonoTutor;
          else{
            Swal.fire({
              title: "Error",
              text: "No. de teléfono inválido",
              icon: "error",
              timer: 1000
            });
            dato.telefono_tutor = data.telefono_tutor;
            return false;
          }
        } 
        else dato.telefono_tutor = data.telefono_tutor;
        if(registrarlvlAcademico) dato.nivelAcademico = registrarlvlAcademico; else dato.nivelAcademico = data.nivelAcademico;
        if (registrarSchoolProcedente) dato.escuelaProcedente = registrarSchoolProcedente; else dato.escuelaProcedente = data.escuelaProcedente;
        if (registrarUniAspirada) dato.colegioAspirado = registrarUniAspirada; else dato.colegioAspirado = data.colegioAspirado;
        if (registrarCarreraAspirada) dato.carreraAspirada = registrarCarreraAspirada; else dato.carreraAspirada = data.carreraAspirada;
        
        if (registrarFechaCurso) dato.fechaInicioCurso = registrarFechaCurso; 
        else{
          if(data.fechaInicioCurso == null)
            dato.fechaInicioCurso = null;
          else{
            const fechaISO1 = data.fechaInicioCurso;
            const fecha1 = new Date(fechaISO1);
            const dia1 = fecha1.getDate();
            const mes1 = fecha1.getMonth() + 1;
            const anio1 = fecha1.getFullYear(); 
            const newfecha1 = `${anio1}-${mes1}-${dia1}`;
            console.log(newfecha1);
            dato.fechaInicioCurso = newfecha1
          }
        }
        
        if (registrarFechaExamen) dato.fechaExamenDiagnostico = registrarFechaExamen; 
        else {
          if(data.fechaExamenDiagnostico == null)
            dato.fechaExamenDiagnostico = null;
          else{
            const fechaISO2 = data.fechaExamenDiagnostico;
            const fecha2 = new Date(fechaISO2);
            const dia2 = fecha2.getDate();
            const mes2 = fecha2.getMonth() + 1;
            const anio2 = fecha2.getFullYear();
            const newfecha2 = `${anio2}-${mes2}-${dia2}`;
            console.log(newfecha2);
            dato.fechaExamenDiagnostico = newfecha2;
          }
        }
        if (registrarlvlMatematic) dato.nivelMatematico = registrarlvlMatematic; else dato.nivelMatematico = data.nivelMatematico;
        if (registrarlvlAnalitic) dato.nivelAnalitico = registrarlvlAnalitic; else dato.nivelAnalitico = data.nivelAnalitico;
        if (registrarlvlLang) dato.nivelLinguistico = registrarlvlLang; else dato.nivelLinguistico = data.nivelLinguistico;
        if (registrarlvlCompren) dato.nivelComprension = registrarlvlCompren; else dato.nivelComprension = data.nivelComprension;
        if (registrarlvlGeneral) dato.nivelGeneral = registrarlvlGeneral; else dato.nivelGeneral = data.nivelGeneral;

        fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dato)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error);
                    });
                }
                return response.json();
            })
            .then(datos => {
                console.log("Alumno registrado: ", datos);
                setTimeout(() => {
                    navigate('/alumnos');
                }, 1000);
                Swal.fire({
                    title: "Éxito",
                    text: "Alumno actualizado correctamente",
                    icon: "success",
                    timer: 1000
                });
                return true;
            })
            .catch(error => {
              console.error('Error: ', error);
              let errorMessage = "Error desconocido";
              if (error.message.includes("NetworkError")) {
                  errorMessage = "Error de red, por favor revisa tu conexión";
              } else if (error.message.includes("404")) {
                  errorMessage = "Endpoint no encontrado";
              } else if (error.message.includes("500")) {
                  errorMessage = "Error interno del servidor";
              } else if (error.message.includes("datos duplicados")) {
                  errorMessage = "Datos duplicados, por favor revisa la información ingresada";
              }
              Swal.fire({
                  title: "Error",
                  text: errorMessage,
                  icon: "error",
                  timer: 1000
              });
              authentificateUser();
              return false;
            });
      }
  };

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


  return (
    <div>
      <div>
        <HeaderSubP title={"Editar Datos Alumno"}/>
        <BotonReturn enlace={'/alumnos'}/>
      </div>

      <div className='Inputsagg'>
    <div className='D-Alumno'>
        <div className='con1'>
            <label htmlFor='inputNoControl'>No. Control</label>
            <input type='text' placeholder={data.noControl || 'N/A'} id='inputNoControl' maxLength={10}/>
            <label htmlFor='inputNombre'>Nombre*</label>
            <input type="text" placeholder={data.nombre || 'Nombre*'} id='inputNombre' maxLength={45}/>
            <label htmlFor='inputApellidoP'>Apellido Paterno*</label>
            <input type="text" placeholder={data.apellido_p || 'Apellido Paterno*'} id='inputApellidoP' maxLength={45}/>
            <label htmlFor='inputApellidoM'>Apellido Materno*</label>
            <input type="text" placeholder={data.apellido_m || 'Apellido Materno*'} id='inputApellidoM' maxLength={45}/>
        </div>
        <div className='con2-Edit'>
            <label htmlFor='inputGrado'>Grado*</label>
            <input type='number' placeholder={data.grado || 'Grado*'} id='inputGrado'/>
            <label htmlFor='inputGrupo'>Grupo*</label>
            <input type='text' placeholder={data.grupo || 'Grupo*'} id='inputGrupo' maxLength={1}/>
            <label htmlFor='inputTurno'>Turno</label>
            <select id='inputTurno'>
                <option value={0}>Seleccionar Turno</option>
                <option value={1}>Matutino</option>
                <option value={2}>Vespertino</option>
            </select>
            <label htmlFor='inputEstatus'>Estatus</label>
            <select id='inputEstatus'>
                <option value={0}>Seleccionar Estatus</option>
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
                <option value={3}>Dado de baja</option>
                <option value={4}>Egresado</option>
            </select>
        </div>
        <div className='con2'>
            <label htmlFor='inputTelefono'>Teléfono*</label>
            <input type="number" placeholder={data.telefono || 'Telefono*'} id='inputTelefono' maxLength={12}/>
            <label htmlFor='inputCorreo'>Correo Electrónico*</label>
            <input type="text" placeholder={data.correo || 'Correo Electronico*'} id='inputCorreo' maxLength={45}/>
            <label htmlFor='inputCurp'>CURP*</label>
            <input type="text" placeholder={data.curp || 'CURP*'} id='inputCurp' maxLength={18}/>
        </div>
        <div className='con4'>
            <label htmlFor='inputlvlAcademic'>Nivel académico actual</label>
            <input type="text" placeholder={data.nivelAcademico || 'Nivel académico actual'} id='inputlvlAcademic' maxLength={45}/>
        </div>
    </div>
    <div>
        <h2>Datos del Tutor</h2>
        <br />
        <br />
        <div className='D-Tutor'>
            <label htmlFor='inputNombreTutor'>Nombre*</label>
            <input type="text" placeholder={data.nombre_tutor || 'Nombre*'} id='inputNombreTutor' maxLength={45}/>
            <label htmlFor='inputApellidoPTutor'>Apellido Paterno*</label>
            <input type="text" placeholder={data.apellidoP_tutor || 'Apellido Paterno*'} id='inputApellidoPTutor' maxLength={45}/>
            <label htmlFor='inputApellidoMTutor'>Apellido Materno*</label>
            <input type="text" placeholder={data.apellidoM_tutor || 'Apellido Materno*'} id='inputApellidoMTutor' maxLength={45}/>
            <label htmlFor='inputTelefonoTutor'>Teléfono*</label>
            <input type="number" placeholder={data.telefono_tutor || 'Telefono*'} id='inputTelefonoTutor' maxLength={12}/>
        </div>
    </div>
    <div>
      <br />
      <br />
        <h2>Datos del Examen de Diagnostico del curso Pre-universitario</h2>
        <br />
        <br />
        <div className='D-Diagnostico-Edit'>
            <h4>Examen Diagnostico Ceneval "EXANII II"</h4>
            <div className='con5'>
                <label htmlFor='inputColegioProveniente'>Colegio de proveniencia</label>
                <input type='text' placeholder={data.escuelaProcedente || 'Colegio de proveniencia'} id='inputColegioProveniente' maxLength={45}/>
                <label htmlFor='inputUniversidadAspira'>Universidad a la que aplica</label>
                <input type="text" placeholder={data.colegioAspirado || 'Universidad a la que aplica'} id='inputUniversidadAspira' maxLength={45}/>
                <label htmlFor='inputCarreraAspira'>Carrera a la que aplica</label>
                <input type="text" placeholder={data.carreraAspirada || 'Carrera a la que aplica'} id='inputCarreraAspira' maxLength={45}/>
            </div>
            <div className='con5-Edit'>
                <label htmlFor='inputFechaCurso'>Fecha de inicio del curso</label>
                <input type='date' id='inputFechaCurso' />
                <label htmlFor='inputFechaExamen'>Fecha del examen de Diagnostico</label>
                <input type='date' id='inputFechaExamen' />
            </div>
            <br />
            <br />
            <h4>Puntajes del examen</h4>
            <div className='con6-Edit'>
                <label htmlFor='inputMatScore'>Pensamiento Matemático</label>
                <input type="number" placeholder={data.nivelMatematico || 'Pensamiento Matematico'} id='inputMatScore' />
                <label htmlFor='inputAnalitScore'>Pensamiento Analítico</label>
                <input type="number" placeholder={data.nivelAnalitico || 'Pensamiento Analitico'} id='inputAnalitScore' />
                <label htmlFor='inputLangScore'>Estructura de la lengua</label>
                <input type="number" placeholder={data.nivelLinguistico || 'Estructura de la lengua'} id='inputLangScore' />
                <label htmlFor='inputLectScore'>Comprensión Lectora</label>
                <input type="number" placeholder={data.nivelComprension || 'Comprension Lectora'} id='inputLectScore' />
            </div>
            <div className='con7-Edit'>
                <label htmlFor='inputGenScore'>Puntaje general</label>
                <input type="number" placeholder={data.nivelGeneral || 'Puntaje general'} id='inputGenScore' />
            </div>
        </div>
    </div>


        <div className='botones-Edit'>
          <button onClick={handleCancelClick} className='uno-Edit'>
            <MdOutlineCancel className='icon-cancel-Edit' />
          </button>
          <button onClick={handleSaveClick} className='dos-Edit'>
            <FiSave className='icon-save-Edit'/>
          </button>
        </div>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
}
