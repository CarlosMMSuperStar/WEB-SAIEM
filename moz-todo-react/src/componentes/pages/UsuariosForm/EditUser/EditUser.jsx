import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import Swal from 'sweetalert2';
import { LogInfoContext } from "../../../../LogInfo";
import './EditUser.css'
import HeaderSubP from "../../../Molecules/HeaderSubP/HeaderSubP";
import BotonReturn from "../../../Atoms/BotonReturn/BotonReturn";
import Footer from "../../../cells/Footer/Footer";
//Por un lado, el header o cabecera es una molécula, por su nivel de complejidad, y por el otro,
//El formulario, es una plantilla, los botones de guardar y cancelar son dos átomos en sí mismos,
//Y juntos conforman una molécula, y el conjunto de inputs conformar el ser vivo
export default function EditUser (){
    const location = useLocation();
    const navigate = useNavigate();
    const [coincidencias, setCoincidencias] = useState([]);
    const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
    const { data } = location.state || {};

    const [newName, setNewName] = useState("");
    const [newTipo, setNewTipo] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    if (!data) {
        setTimeout(() => {
          navigate('/usuarios');
        }, 1000);
        return <div>No data available</div>;
    } else
    console.log(data.id)

    const comprobarSiElUsuarioYaExiste = async (userNameComp) => {
        const url = `https://saiemapi.integrador.xyz/usersJWT/compUser`;
        const token = localStorage.getItem('token');

        let comprobarUser = {
            idNombreAComprobar: userNameComp
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(comprobarUser)
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
    }

    const editarNombre = async () => {
        if(!newName){
            Swal.fire({
                title: "Error",
                text: "Ingrese el nombre",
                icon: "error",
                timer: 1000
            });
            return false;
        } else if (await comprobarSiElUsuarioYaExiste(newName)){
            Swal.fire({
                title: "Error",
                text: "Al parecer ya hay un usuario con ese nombre",
                icon: "error",
                timer: 1000
            });
            return false;
        } else {
            Swal.fire({
                title: "Éxito",
                text: "Guarde los cambios para efectuar el cambio",
                icon: "success",
                timer: 1000
            });
            return true;
        }
    }

    const editarTipo = () => {
        if(newTipo == ""){
            Swal.fire({
                title: "Error",
                text: "Seleccione un tipo de usuario",
                icon: "error",
                timer: 1000
            });
            return false;
        } else {
            if(newTipo == "admin"){
                const tipoUsuario = localStorage.getItem('typeUser');
                if(tipoUsuario != "master"){
                    Swal.fire({
                        title: "No autorizado",
                        text: "Usted no tiene permiso para cambiar el tipo de usuario a administrador",
                        icon: "error",
                        timer: 1000                    
                    });
                    return false
                }
            }
            Swal.fire({
                title: "Éxito",
                text: "Guarde los cambios para efectuar el cambio",
                icon: "success",
                timer: 1000
            });
            return true;
        }
    }

    const editarUsuario = async () => {
        const url = `https://saiemapi.integrador.xyz/usersJWT/update/${data.id}`;
        const token = localStorage.getItem('token');

        let user = {
            nombre: newName || data.nombre_usuario,
            password: "", 
            tipo: newTipo || data.tipo
        };

        if(!newPwd || !confirmPwd){
            Swal.fire({
                title: "Error",
                text: "Tiene que cambiar la contraseña para guardar los cambios",
                icon: "error",
                timer: 1000
            });
            return false;
        } else if (newPwd.length < 8){
            Swal.fire({
                title: "Error",
                text: "Contraseña muy corta, ingrese al menos 8 caracteres",
                icon: "error",
                timer: 1000
            });
            return false;
        } else if (newPwd !== confirmPwd){
            Swal.fire({
                title: "Error",
                text: "Asegúrese de ingresar la misma contraseña en ambos campos para contraseña",
                icon: "error",
                timer: 1000
            });
            return false;
        } else {
            user.password = newPwd;

            if(newTipo == "admin"){
                const tipoUsuario = localStorage.getItem('typeUser');
                if(tipoUsuario != "master"){
                    Swal.fire({
                        title: "No autorizado",
                        text: "Usted no tiene permiso para cambiar el tipo de usuario a administrador",
                        icon: "error",
                        timer: 1000                    
                    });
                    return false
                }
            }

            fetch(url, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(user)
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
                console.log("Usuario editado: ", data);
                setTimeout(() => {
                    navigate('/usuarios');
                }, 1000);
                Swal.fire({
                    title: "Éxito",
                    text: "Usuario actualizado correctamente",
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
    }

    const handleSaveClick = () => {
        Swal.fire({
            title: "¿Desea guardar los cambios?",
            showCancelButton: true,
            confirmButtonText: "Guardar",
        }).then((result) => {
            if (result.isConfirmed) {
                editarUsuario();
            }
        });
    };

    const handleCancelClick = () => {
        Swal.fire({
          title: "Cancelar Edición ¿?",
          text: "Se borrarán los datos ingresados",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "Sí, Cancelar Edición",
          cancelButtonText: "Seguir Editando",
        }).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
                navigate('/usuarios');
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

    
    return (
        <div>
            <div>
                <HeaderSubP title={"Editar Usuario"}/>
                <BotonReturn/>
            </div>


            <div className='EditUser'>
    <div className='Edit'>
        <div className='editU'>
            <input 
                type="text" 
                placeholder='Nombre del usuario' 
                id='inputUserName' 
                maxLength={35}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={editarNombre}>Cambiar nombre</button>
        </div>
        <div className='editU'>
            <select 
                id="selectTipo"
                value={newTipo}
                onChange={(e) => setNewTipo(e.target.value)}
            >
                <option value={""}>Seleccionar tipo de usuario</option>
                <option value={"employe"}>Personal</option>
                <option value={"admin"}>Administrador</option>
            </select>
            <button onClick={editarTipo}>Cambiar tipo de usuario</button>
        </div>
        <div className='editU'>
            <input 
                type='password' 
                placeholder='Contraseña' 
                id='inputPassword' 
                maxLength={20}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
            />
            <input 
                type='password' 
                placeholder='Confirmar' 
                id="inputCPassword" 
                maxLength={20}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
            />
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
