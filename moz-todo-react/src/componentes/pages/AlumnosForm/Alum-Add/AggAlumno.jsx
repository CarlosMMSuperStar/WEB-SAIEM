import React, {useState, useContext, useEffect} from 'react'
import './AggAlumno.css'
import Logo2 from './AggAssets/Logo2.png';
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { LogInfoContext } from '../../../../LogInfo';
import BotonReturn from '../../../Atoms/BotonReturn/BotonReturn';
import HeaderSubP from '../../../Molecules/HeaderSubP/HeaderSubP';
import Footer from "../../../cells/Footer/Footer";


//Por un lado, el header o cabecera es una molécula, por su nivel de complejidad, y por el otro,
//El formulario, es una plantilla, los botones de guardar y cancelar son dos átomos en sí mismos,
//Y juntos conforman una molécula, y el conjunto de inputs conformar el ser vivo
export default function AggAlumno() {
    const [coincidencias, setCoincidencias] = useState([]); //Necesario para obtener recursos
    const [error, setError] = useState(null);
    const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);

    const handleSaveClick = () => {
        Swal.fire({
            title: "¿Desea guardar los cambios?",
            showCancelButton: true,
            confirmButtonText: "Guardar",
        }).then((result) => {
            if (result.isConfirmed) {
                mandarALaBaseDeDatos();
            }
        });
    };

    const handleCancelClick = () =>{
        Swal.fire({
            title: "Cancelar Registro ¿?",
            text: "Se borraran los datos ingresados",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#d33",
            confirmButtonText: "Si, Cancelar Registro",
            cancelButtonText: "Volver al Registro",
          }).then((result) => {
            if (result.isConfirmed) {
              setTimeout(() => {
                  navigate('/alumnos');
              }, 1000);
            }
          })
    }

    const navigate = useNavigate();

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
            authentificateUser();
            return false;
        }
    };
    
    const mandarALaBaseDeDatos = async () => {
        const token = localStorage.getItem('token');
        const url = "https://saiemapi.integrador.xyz/alumnos/addAlumno";
        let data = {
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
        let registrarEstado = 1;
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

        if (!registrarNoControl || !registrarNombre || !registrarApellidoP && !registrarApellidoM || !registrarGrado || !registrarGrupo || !registrarTurno || !registrarEstado || !registrarTelefono || !registrarCorreo || !registrarCurp || !registrarlvlAcademico || !registrarNombreTutor || !registrarApellidoPTutor || !registrarApellidoMTutor || !registrarTelefonoTutor) {
            console.log("Hay campos obligatorios sin llenar");
            Swal.fire({
                title: "Error",
                text: "Hay campos obligatorios sin llenar",
                icon: "error",
                timer: 1000
            });
            return false;
            // Agregar logica del error
        } else if (!comprobarSiEsNumero(registrarNoControl) || !comprobarSiEsNumero(registrarTelefono) || !comprobarSiEsNumero(registrarTelefonoTutor) || registrarGrado <= 0 || registrarGrado > 17){
            //Agregar la logica del error
            Swal.fire({
                title: "Error",
                text: "Datos inválidos en los campos numéricos",
                icon: "error",
                timer: 1000
            });
            return false;
        } else if (await comprobarSiHayDatosRepetidos(registrarNoControl, registrarCurp)){
            //Agregar la logica del error
            Swal.fire({
                title: "Error",
                text: "Ya existen registros con el mismo número de control o CURP",
                icon: "error",
                timer: 1000
            });
            return false;
        } else {
            data.nombre = registrarNombre;
            data.apellido_p = registrarApellidoP;
            data.apellido_m = registrarApellidoM;
            data.grado = registrarGrado;
            data.grupo = registrarGrupo;
            data.turno = registrarTurno;
            data.noControl = registrarNoControl;
            data.estado = registrarEstado;
            data.curp = registrarCurp;
            data.telefono = registrarTelefono;
            data.correo = registrarCorreo;
            data.nombre_tutor = registrarNombreTutor;
            data.apellido_p_tutor = registrarApellidoPTutor;
            data.apellido_m_tutor = registrarApellidoMTutor;
            data.telefono_tutor = registrarTelefonoTutor;
            data.nivelAcademico = registrarlvlAcademico;
            if (registrarSchoolProcedente) data.escuelaProcedente = registrarSchoolProcedente; else data.escuelaProcedente = "N/A";
            if (registrarUniAspirada) data.colegioAspirado = registrarUniAspirada; else data.colegioAspirado = "N/A";
            if (registrarCarreraAspirada) data.carreraAspirada = registrarCarreraAspirada; else data.carreraAspirada = "N/A"
            if (registrarFechaCurso) data.fechaInicioCurso = registrarFechaCurso; else data.fechaInicioCurso = null;
            if (registrarFechaExamen) data.fechaExamenDiagnostico = registrarFechaExamen; else data.fechaExamenDiagnostico = null;
            if (registrarlvlMatematic) data.nivelMatematico = registrarlvlMatematic; else data.nivelMatematico = 0;
            if (registrarlvlAnalitic) data.nivelAnalitico = registrarlvlAnalitic; else data.nivelAnalitico = 0;
            if (registrarlvlLang) data.nivelLinguistico = registrarlvlLang; else data.nivelLinguistico = 0;
            if (registrarlvlCompren) data.nivelComprension = registrarlvlCompren; else data.nivelComprension = 0;
            if (registrarlvlGeneral) data.nivelGeneral = registrarlvlGeneral; else data.nivelGeneral = 0;

            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Alumno registrado: ", data);
                    setTimeout(() => {
                        navigate('/alumnos');
                    }, 1000);
                    Swal.fire({
                        title: "Éxito",
                        text: "Alumno registrado correctamente",
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
            <HeaderSubP title={"Registrar Alumno"}/>

        </div>


        <div className='Inputsagg'>

        <div className='D-Alumno'>
                    <BotonReturn enlace={'/alumnos'}/>

                    <p id='CO'>Campos obligatorios:</p>
                    <div className='con1'>
                        <input type='text' placeholder='No. Control' id='inputNoControl' maxLength={10}/>
                        <input type="text" placeholder='Nombre*' id='inputNombre' maxLength={45}/>
                        <input type="text" placeholder='Apellido Paterno*' id='inputApellidoP' maxLength={45}/>
                        <input type="text" placeholder='Apellido Materno*' id='inputApellidoM' maxLength={45}/>
                    </div>
                    <div className='con1'>
                        <input type='number' placeholder='Grado*' id='inputGrado' maxLength={2}/>
                        <input type='text' placeholder='Grupo*' id='inputGrupo' maxLength={1}/>
                        <select id='inputTurno'>
                            <option> Seleccionar turno </option>
                            <option value={1}>Matutino</option>
                            <option value={2}>Vespertino</option>
                        </select>
                    </div>
                    <div className='con2'>
                        <input type="tel" placeholder='Telefono*' id='inputTelefono' maxLength={12}/>
                        <input type="email" placeholder='Correo Electronico*' id='inputCorreo' maxLength={45} />
                        <input type="text" placeholder='CURP*' id='inputCurp' maxLength={18}/>
                        <input type="text" placeholder='Nivel académico actual' id='inputlvlAcademic' maxLength={45}/>
                    </div>

                </div>
                <div>
                    <br />
                    <h2>Datos del Tutor</h2>
                    <div className='D-Tutor'>
                        <input type="text" placeholder='Nombre*' id='inputNombreTutor' maxLength={45}/>
                        <input type="text" placeholder='Apellido Paterno*' id='inputApellidoPTutor' maxLength={45}/>
                        <input type="text" placeholder='Apellido Materno*' id='inputApellidoMTutor' maxLength={45}/>
                        <input type="tel" placeholder='Telefono*' id='inputTelefonoTutor' maxLength={12}/>
                    </div>
                </div>
                <div>
                    <br />
                    <h2>Datos del Examen de Diagnostico del curso Pre-universitario</h2>
                    <div className='D-Diagnostico'>
                        <h4>Examen Diagnostico Ceneval "EXANII II"</h4>
                        <div className='con5'>
                            <input type='text' placeholder='Colegio de proveniencia' id='inputColegioProveniente' maxLength={45}/>
                            <input type="text" placeholder='Universidad a la que aplica' id='inputUniversidadAspira' maxLength={45}/>
                            <input type="text" placeholder='Carrera a la que aplica' id='inputCarreraAspira' maxLength={45}/>
                        </div>
                        <div className='con3'>
                            <label>Fecha de inicio del curso</label>
                            <input type='date' id='inputFechaCurso' />
                            <label>Fecha del examen de Diagnostico</label>
                            <input type='date' id='inputFechaExamen' />
                        </div>
                        <br />
                        <h4>Puntajes del examen</h4>
                        <div className='con5'>
                            <input type="number" placeholder='Pensamiento Matematico' id='inputMatScore' max={100} min={0}/>
                            <input type="number" placeholder='Pensamiento Analitico' id='inputAnalitScore' max={100} min={0}/>
                            <input type="number" placeholder='Estructura de la lengua' id='inputLangScore' max={100} min={0}/>
                            <input type="number" placeholder='Comprension Lectora' id='inputLectScore' max={100} min={0}/>
                            <input type="number" placeholder='Puntaje general' id='inputGenScore' max={100} min={0}/>

                        </div>

                    </div>
                </div>
            <div className='botones'>

            <button onClick={handleCancelClick} className='uno'><MdOutlineCancel className='icon-cancel' /></button>
            <button onClick={handleSaveClick} className='dos'><FiSave className='icon-save'/></button>

            </div>
        </div>
        <div>
            <Footer/>
        </div>
    </div>
  )
}
