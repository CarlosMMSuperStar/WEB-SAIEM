import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import FilaMateria from '../../../Molecules/FilaMateria/FilaMateria';
import { LogInfoContext } from '../../../../LogInfo';
//import Logo2 from '../AlumnosForm/Alum-Add/AggAssets/Logo2.png';
import Swal from 'sweetalert2';
import './EditProfesor.css';
import HeaderSubP from '../../../Molecules/HeaderSubP/HeaderSubP';
import BotonReturn from '../../../Atoms/BotonReturn/BotonReturn';
import Footer from '../../../cells/Footer/Footer';

//Por un lado, el header o cabecera es una molécula, por su nivel de complejidad, y por el otro,
//El formulario, es una plantilla, los botones de guardar y cancelar son dos átomos en sí mismos,
//Y juntos conforman una molécula, y el conjunto de inputs conformar el ser vivo
export default function EditProfesor (){
    const location = useLocation();
    const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
    const [coincidencias, setCoincidencias] = useState([]);
    const [dataMat, setDataMat] = useState([]);
    const [error, setError] = useState(null);
    const { data } = location.state || {};
    const navigate = useNavigate();
    if (!data) {
        setTimeout(() => {
            navigate('/empleados');
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
                actualizarMaestro()
            }
        });
    };

    const handleCancelClick = () =>{
        Swal.fire({
            title: "Cancelar actualización ¿?",
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
                  navigate('/empleados');
              }, 1000);
            }
          })
    }

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

    const comprobarSiElSueldoEsValido = (comprobarMonto) => {
        const valoresAceptados = /^-?\d+(\.\d+)?$/;
        if (valoresAceptados.test(comprobarMonto)) {
            console.log(comprobarMonto + " es un valor válido");
            return true;
        } else {
            console.log(comprobarMonto + " no es un valor válido");
            return false;
        }
    }

    const comprobarSiExisteElMaestro = async (nombreEmpleado, apellidoPEmpleado, apellidoMEmpleado) => {
        const url = `https://saiemapi.integrador.xyz/empleados/comprobarProfesores`;
        const token = localStorage.getItem('token');

        const comprobarProfe = {
            nombreComp : nombreEmpleado, 
            apellido_pComp : apellidoPEmpleado, 
            apellido_mComp : apellidoMEmpleado
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(comprobarProfe)
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
    }


    const actualizarMaestro = async () => {
            const url = `https://saiemapi.integrador.xyz/empleados/updateProfesor/${data.id}`
            const token = localStorage.getItem('token');

            let dato = {
                nombre : "", 
                apellido_p : "", 
                apellido_m : "", 
                telefono : "", 
                correo : "", 
                curp : "", 
                sueldoPorHora : "",
                id_estatus : "",
                id_especialidad : ""
            }

            let nombreRegistro = document.getElementById("inputNombre").value;
            let apellido_pRegistro = document.getElementById("inputApellidoP").value;
            let apellido_mRegistro = document.getElementById("inputApellidoM").value;
            let telefonoRegistro = document.getElementById("inputTelefono").value;
            let correoRegistro = document.getElementById("inputCorreo").value;
            let curpRegistro = document.getElementById("inputCurp").value;
            let especialidadRegistro = document.getElementById("selectEspecialidad").value
            let sueldoRegisro = document.getElementById("inputSueldo").value;
            let estatusRegistro = document.getElementById("selectEstatus").value;

            if(especialidadRegistro == 0 || estatusRegistro == 0){
                Swal.fire({
                    title: "Error",
                    text: "No olvide seleccionar el área y la especialidad del maestro",
                    icon: "error",
                    timer: 1000
                });
                return false
            } else if(await comprobarSiExisteElMaestro(nombreRegistro, apellido_pRegistro, apellido_mRegistro)){
                Swal.fire({
                    title: "Error",
                    text: "Al parecer ya está registrado este maestro",
                    icon: "error",
                    timer: 1000
                });
                return false;
            }else{
                if(nombreRegistro) dato.nombre = nombreRegistro; else dato.nombre = data.nombre;
                if(apellido_pRegistro) dato.apellido_p = apellido_pRegistro; else dato.apellido_p = data.apellido_p;
                if(apellido_mRegistro) dato.apellido_m = apellido_mRegistro; else dato.apellido_m = data.apellido_m;
                if(telefonoRegistro){
                    if(!comprobarSiEsNumero(telefonoRegistro)){
                        Swal.fire({
                            title: "Error",
                            text: "Número de teléfono inválido",
                            icon: "error",
                            timer: 1000
                        });
                        dato.telefono = data.telefono; 
                        return false;
                    } else dato.telefono = telefonoRegistro; 
                } else dato.telefono = data.telefono;
                if(correoRegistro) dato.correo = correoRegistro; else dato.correo = data.correo;
                if(curpRegistro) dato.curp = curpRegistro; else dato.curp = data.curp;
                dato.id_especialidad = especialidadRegistro;
                if(sueldoRegisro){
                    if(!comprobarSiElSueldoEsValido(sueldoRegisro) || sueldoRegisro <= 0 || sueldoRegisro > 100000.00){
                        Swal.fire({
                            title: "Error",
                            text: "Ingrese un monto válido",
                            icon: "error",
                            timer: 1000
                        });
                        dato.sueldoPorHora = data.sueldoPorHora;
                        return false; 
                    } else dato.sueldoPorHora = sueldoRegisro;
                } else dato.sueldoPorHora = data.sueldoPorHora;
                dato.id_estatus = estatusRegistro;

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
                .then(data => {
                    console.log("Alumno registrado: ", data);
                    setTimeout(() => {
                        navigate('/empleados');
                    }, 1000);
                    Swal.fire({
                        title: "Éxito",
                        text: "Maestro actualizado correctamente",
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
                    authentificateUser()
                    return false;
                });
            }   
    }

    const imprimirMateriasDelProfesor = () => {
        const url = `https://saiemapi.integrador.xyz/empleados/showMat`
        const token = localStorage.getItem('token');

        fetch(`${url}/${data.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
              throw new Error('Error al imprimir los datos del profesor: ' + response.status);
            }
            return response.json();
        })
        .then(response => {
            setDataMat(response);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setError(error.message);
            authentificateUser();
        });
    }

    const agregarMateria = () => {
        const url = `https://saiemapi.integrador.xyz/empleados/materias`
        const token = localStorage.getItem('token');

        let dataMateria = {
            idMateria : "",
            idMaestro : data.id
        }

        let registrarMateria = document.getElementById("selectMateria").value;
        if(!registrarMateria)
            console.log("Seleccione una materia")
        else{

            if (dataMat.some(materia => materia.id === parseInt(registrarMateria))) {
                Swal.fire({
                    title: "Error",
                    text: "La materia ya ha sido asignada al profesor.",
                    icon: "error",
                    timer: 1000
                });
                return; 
            }

            dataMateria.idMateria = registrarMateria;

            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataMateria)
            })
            .then(response => {
              if(!response.ok){
                throw new Error('Error al imprimir los alumnos: ' + response.status);
              }
              return response.json();
            })
              //Si todo esta bien, recibe la respuesta
            .then(response => {
                console.log("Se agrego la materia : ", response)
                imprimirMateriasDelProfesor();
            })
            .catch(error => {
                setError(error.message);
                authentificateUser();
            });
        }
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

    useEffect(() => {
        imprimirMateriasDelProfesor();
    }, []);

    return (
    <div>

        <div>
            <HeaderSubP title={"Editar Datos Maestro"}/>
            <BotonReturn enlace={'/empleados'}/>
        </div>


        <div className='Inputsagg'>
    <div className='D-Alumno'>
        <div className='con1'>
            <label htmlFor='inputNombre'>Nombre</label>
            <input type="text" placeholder={data.nombre} id='inputNombre' maxLength={45}/>
            
            <label htmlFor='inputApellidoP'>Apellido Paterno</label>
            <input type="text" placeholder={data.apellido_p} id='inputApellidoP' maxLength={45}/>
            
            <label htmlFor='inputApellidoM'>Apellido Materno</label>
            <input type="text" placeholder={data.apellido_m} id='inputApellidoM' maxLength={45}/>
            
            <label htmlFor='selectEstatus'>Estatus</label>
            <select id='selectEstatus'>
                <option id='status' value={0}>Seleccionar status</option>
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
                <option value={3}>Dado de baja</option>
            </select>
        </div>
        <div className='con2'>
            <label htmlFor='inputTelefono'>Teléfono</label>
            <input type="tel" placeholder={data.telefono} id='inputTelefono' maxLength={12}/>
            
            <label htmlFor='inputCorreo'>Correo</label>
            <input type="email" placeholder={data.correo} id='inputCorreo' maxLength={45} />
            
            <label htmlFor='inputCurp'>CURP</label>
            <input type="text" placeholder={data.curp} id='inputCurp' maxLength={18}/>
        </div>
        <div className='con1'>
            <select id="selectEspecialidad">
                <option value={0}>Seleccionar especialidad</option>
                <option value={1}>Ciencias: Físico-Matemático</option>
                <option value={2}>Ciencias: Químico-Biológicas</option>
                <option value={3}>Ciencias Sociales y Humanidades</option>
                <option value={4}>Lengua y Comunicación</option>
            </select>
            
            <label htmlFor='inputSueldo'>Sueldo por Hora</label>
            <input type="number" placeholder={data.sueldoPorHora} id="inputSueldo" maxLength={8}/>
        </div>
        <div className='con1p'>
            <table>
                <thead>
                    <tr>
                        <th>Materias</th>
                    </tr>
                </thead>
                <tbody>
                    {error && <tr><td>Error: {error}</td></tr>}
                    {!dataMat.length && <tr><td>No imparte ninguna Materia</td></tr>}
                    {!error && dataMat.length > 0 && (
                        dataMat.map((materia, index) => (
                            <FilaMateria key={index} idProfesor={data.id} idMateria={materia.id} nombreMateria={materia.nombre} actualizar={imprimirMateriasDelProfesor} autentificar={authentificateUser}/>
                        ))
                    )}
                    <tr>
                        <td>
                            <select id='selectMateria'>
                                <option value="">Seleccionar materia</option>
                                <option value={1}>Pensamiento Matemático</option>
                                <option value={2}>Pensamiento Analítico</option>
                                <option value={3}>Física</option>
                                <option value={4}>Química</option>
                                <option value={5}>Biología</option>
                                <option value={6}>Ciencias de la Salud</option>
                                <option value={7}>Historia Universal y de México</option>
                                <option value={8}>Geografia</option>
                                <option value={9}>Filosofía</option>
                                <option value={10}>Estructura de la Lengua</option>
                                <option value={11}>Comprensión Lectora</option>
                                <option value={12}>Literatura</option>
                            </select>
                        </td>
                        <td><button onClick={agregarMateria}>Agregar</button></td>
                    </tr>
                </tbody>
            </table>
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
    );
}