import React from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function FilaUsuarios ({data, actualizar, autentificar}){
    const navigate = useNavigate();

    const fetchDelete = () => {
        const url = `https://saiemapi.integrador.xyz/usersJWT/delete/${data.id}`
        const token = localStorage.getItem('token');

        fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error al "Eliminar": ' + response.status);
            }
            return response.json();
        })
        .then(response => {
            console.log("Eliminando");
            Swal.fire({
                title: "Éxito",
                text: "Se eliminó el usuario",
                icon: "success",
                timer: 1000
            });
            actualizar();
            return true;
        })
        .catch(error => {
            console.log("Error : ", error);
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
            autentificar();
            return false;
        });
    }

    const deleteUser = () => {
        const tipoUsuario = localStorage.getItem('typeUser');

        if(data.tipo == "admin"){
            if(tipoUsuario == "master")
                fetchDelete();
            else{
                Swal.fire({
                    title: "No autorizado",
                    text: "Usted no tiene permiso para hacer eso",
                    icon: "error",
                    timer: 1000                    
                });
                return false
            }
        } else fetchDelete();
        
    }

    const editUser = () => {
        const tipoUsuario = localStorage.getItem('typeUser');

        if(data.tipo == "admin"){
            if(tipoUsuario == "master")
                navigate('/updateUsers', { state: { data } })
            else{
                Swal.fire({
                    title: "No autorizado",
                    text: "Usted no tiene permiso para hacer eso",
                    icon: "error",
                    timer: 1000                    
                });
                return false
            }
        } else navigate('/updateUsers', { state: { data } });
    }

    const handleSaveClick = () => {
        Swal.fire({
            title: "Esta acción no se puede revertir ¿Estás seguro?",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser();
            }
        });
    };

    return(
        <tr>
            <td>{data.id}</td>
            <td>{data.nombre_usuario}</td>
            <td>{data.tipo}</td>
            <td>{data.nombre_area}</td>
            <td><button onClick={editUser}>Editar</button></td>
            <td><button onClick={handleSaveClick}>Borrar</button></td>
        </tr>
    );
}