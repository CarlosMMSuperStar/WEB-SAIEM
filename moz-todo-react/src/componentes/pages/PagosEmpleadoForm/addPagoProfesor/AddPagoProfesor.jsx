import React, { useState, useEffect, useContext } from 'react';
import Logo2 from './AddAssets/Logo2.png';
import { FiSave } from 'react-icons/fi';
import { MdOutlineCancel } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { IoSearchSharp } from 'react-icons/io5';
import { LogInfoContext } from '../../../../LogInfo';
import './AddPagoProfesor.css'
import HeaderSubP from '../../../Molecules/HeaderSubP/HeaderSubP';
import BotonReturn from '../../../Atoms/BotonReturn/BotonReturn';
import Footer from '../../../cells/Footer/Footer';

//Por un lado, el header o cabecera es una molécula, por su nivel de complejidad, y por el otro,
//El formulario, es una plantilla, los botones de guardar y cancelar son dos átomos en sí mismos,
//Y juntos conforman una molécula, y el conjunto de inputs conformar el ser vivo
export default function AddPagoProfesor () {
    const [nameProfesor, setNameProfesor] = useState([]);
    const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
    const [totalPago, setTotalPago] = useState(0);
    const navigate = useNavigate();

    const optionProfesor = () => {
        const url = "https://saiemapi.integrador.xyz/PagoEmp/optionProfesor";
        const token = localStorage.getItem('token');

        let dato = {
            nombre_busqueda :"",
            apellido_p_busqueda : "",
            apellido_m_busqueda : ""
        }

        let buscarPorNombre = document.getElementById("inputProfesorName").value;
        if(buscarPorNombre)
            dato.nombre_busqueda = buscarPorNombre;
        let buscarPorApellidoP = document.getElementById('inputPersonalApellidop').value;
        if (buscarPorApellidoP) 
            dato.apellido_p_busqueda = buscarPorApellidoP;
        let buscarPorApellidoM = document.getElementById('inputPersonalApellidom').value;
        if (buscarPorApellidoM)
            dato.apellido_m_busqueda = buscarPorApellidoM;

        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body:JSON.stringify(dato)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No conecta');
            }
            return response.json();
        })
        .then(data => {
            setNameProfesor(data);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
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

    const calcularTotalAPagar = () => {
        const idProfesorSelect = document.getElementById("inputIdProfesor").value;
        let registrarHoras = document.getElementById('inputHoras').value;
        if (idProfesorSelect == "not valid" || !registrarHoras || !comprobarSiEsNumero(registrarHoras) || registrarHoras <= 0){
            Swal.fire({
                title: "Error",
                text: "Seleccione un maestro al cual calcular el pago y asigne las horas trabajadas",
                icon: "error",
                timer: 1000
            });
            return false;
        }
        else {
            const url = `https://saiemapi.integrador.xyz/PagoEmp/calcularMontoPro/${idProfesorSelect}`
            const token = localStorage.getItem('token');
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No conecta');
                }
                return response.json();
            })
            .then(data => {
                console.log(data[0].sueldoPorHora);
                setTotalPago(data[0].sueldoPorHora * registrarHoras);
                console.log(totalPago);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                authentificateUser();
            });
            
        }
    }

    const dbPersonal = () => {
            const token = localStorage.getItem('token');
            const url = "https://saiemapi.integrador.xyz/PagoEmp/pagoPro";
            let data = {
                horasTrabajadas: "",
                totalPago: "",
                fechaPago:"",
                idProfesor:"",

            };
            let registrarHoras = document.getElementById('inputHoras').value;
            let registrarTotal = totalPago;
            let registrarFecha = document.getElementById('inputFecha4').value;
            let registraridProfesor = document.getElementById('inputIdProfesor').value;

            if (!registrarHoras || registrarTotal <= 0 || !registrarFecha ||registraridProfesor == "not valid") {
                Swal.fire({
                    title: "Error",
                    text: "Llene todos los campos y calcule el pago total",
                    icon: "error",
                    timer: 1000
                });
                return false;
            } else {
                data.horasTrabajadas = registrarHoras;
                data.totalPago = registrarTotal;
                data.fechaPago = registrarFecha;
                data.idProfesor = registraridProfesor;

                fetch(url, {
                    method: 'POST',
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
                .then(datosReturn => {
                    console.log("Datos guardados: " + datosReturn)
                    setTimeout(() => {
                        navigate('/pagosEmp');
                    }, 1000);
                    Swal.fire({
                        title: "Éxito",
                        text: "Informe de pago de maestro registrado correctamente",
                        icon: "success",
                        timer: 1000
                    });
                    return true;
                })
                .catch(error => {
                    console.error('Error:', error);
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
                });
            }
    };

    const handleSaveClick = () => {
        Swal.fire({
            title: "¿Desea guardar los cambios?",
            showCancelButton: true,
            confirmButtonText: "Guardar",
        }).then((result) => {
            if (result.isConfirmed) {
                dbPersonal();
            }
        });
    };

    const handleCancelClick = () => {
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
                  navigate('/pagosEmp');
              }, 1000);
            }
          })
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
        optionProfesor();
    }, []);

    return (
        <div>
            <div>
                <HeaderSubP title={"Pago Maestros"}/>
                <BotonReturn enlace={'/pagosEmp'}/>
            </div>


            <div className='Inputadd'>
                    <h1>Generar</h1>
                        br
                    <p>Para guardar el informe, tiene que ingresar las horas trabajadas y seleccionar el personal, y clickear en el botón calcular</p>
                <div className='pagoProfesor'>
                    <div className='box_profesor'>
                        <input type="number" placeholder='Horas trabajadas' id='inputHoras' maxLength={10}/>
                        <input type="date" id='inputFecha4' />
                        
                    </div>
                    <div className='searchProfesor'>
                        <input type='text' placeholder='Nombre' id='inputProfesorName' maxLength={45}/>
                        <input type="text" placeholder='apellido paterno' id='inputPersonalApellidop' maxLength={45}/>
                        <input type="text" placeholder='apelllido materno' id='inputPersonalApellidom' maxLength={45}/>
                        <button className='buscar1' onClick={optionProfesor}>< IoSearchSharp />Buscar</button>
                        
                    </div>
                    <div className='searchProfesor'>
                        <br />
                    <p>Seleccionar Profesor</p>
                    
                        <select name='nombre' id="inputIdProfesor">
                            <option value={"not valid"}>profesores</option>
                            {nameProfesor.map(elemento => (
                                <option key={elemento.id} value={elemento.id}>{elemento.nombre} {elemento.apellido_p} {elemento.apellido_m}</option>
                            ))}
                        </select>
                    </div>
                    <br />
                    <div>
                        <h4>Calculando pago:</h4>
                        <button className='calcular' onClick={calcularTotalAPagar}>Calcular</button>
                        <p>{totalPago}</p>
                    </div>
                </div>
            </div>
            <div className='botones'>
                <button onClick={handleCancelClick} className='uno'><MdOutlineCancel className='icon-cancel' /></button>
                <button onClick={handleSaveClick} className='dos'><FiSave className='icon-save' /></button>
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    );
}