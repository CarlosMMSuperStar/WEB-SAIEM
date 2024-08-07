import React, { useState, useEffect } from "react";
import { SiGoogleforms } from "react-icons/si";
import { MdEdit } from "react-icons/md";
import Swal from 'sweetalert2';

export default function FilaTram (
    {idT, folioT, nombreAlm, apellidoP, apellidoM, gradoAlm, grupoAlm, conceptoT, montoT, 
        fechaDeCorteT, estatusTramiteT, actualizarLista, autentificar}){
    
    //Hace maromas para pasar la fecha tipo SQL a una fecha de JS
    const fechaISO = fechaDeCorteT;
    const fecha = new Date(fechaISO);
            
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    const fechaFormateada = `${dia}-${mes}-${anio}`;
    const fechaAComparar = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    const determinarEstatusDePago = () => {
        if (estatusTramiteT == "Pagado"){
            //Si el estatus de pago ya esta pagado, no hace nada
            console.log("Tramite ya pagado");
        }
        else{
            //Si se cuentra pendiende, hace la operacion
            //Extrae la fecha actual
            const fechaActual = new Date();
            const diaActual = String(fechaActual.getDate()).padStart(2, '0');
            const mesActual = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const anioActual = fechaActual.getFullYear();
            const fechaComparacion = `${anioActual}-${mesActual}-${diaActual}`;
        
            //console.log("Hoy es " + fechaComparacion);

            //Crea dis instancias de tipo Date para comparar las fechas
            const fechaActualObj = new Date(fechaComparacion);
            const fechaACompararObj = new Date(fechaAComparar);

            //Compara ambas fechas, obtiene milisegundos, y los pasa a dias de diferencia
            const diferenciaMilisegundos = fechaACompararObj - fechaActualObj;
            const diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

            //console.log(`Diferencia en días: ${diferenciaDias}`);
            if(diferenciaDias < 10 && estatusTramiteT !== "Por pagar" && estatusTramiteT !== "Atrasado"){
                console.log("Se realizó el fetch para pasar el estado a Por Pagar")
                //Si faltan 10 dias para que se venza el pago, lo marcara como proximo
                    actualizarAProximoAPagar();
            }
            if(diferenciaDias <= 0 && estatusTramiteT !== "Atrasado"){
                //Si faltan 0 dias o ya paso la fecha limite, lo marca como atrasado
                console.log("Se realizó el fetch para pasar el estado a atrasado")
                    actualizarAAtrasado();
            }
        }
    }

    useEffect(()=>{
        determinarEstatusDePago();
    }, []);

    const actualizarAProximoAPagar = () => {
        const url = `https://saiemapi.integrador.xyz/tramites/changeNext/${idT}`;
        const token = localStorage.getItem('token');

        fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error al "Pagar cambiar estado de tramite a proximo": ' + response.status);
              }
              return response.json();
        })
        .then(response => {
            console.log("Cambiando estado de tramite a proximo");
            actualizarLista();
        })
        .catch(error => {
            console.log("Error : ", error);
        })
    }

    const actualizarAAtrasado = () => {
        const url = `https://saiemapi.integrador.xyz/tramites/changeArrears/${idT}`;
        const token = localStorage.getItem('token');

        fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error al "Pagar cambiar estado de tramite a atrasado": ' + response.status);
              }
              return response.json();
        })
        .then(response => {
            console.log("Cambiando estado de tramite a atrasado");
            actualizarLista();
        })
        .catch(error => {
            console.log("Error : ", error);
        })
    }
    
    const actualizarAPagado = () => {
        const url = `https://saiemapi.integrador.xyz/tramites/changePaid/${idT}`
        const token = localStorage.getItem('token');

        if(estatusTramiteT !=="Pagado"){
            fetch(url, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => {
                if(!response.ok){
                throw new Error('Error al "Pagar tramite": ' + response.status);
                }
                return response.json();
            })
            .then(response => {
                console.log("Tramite pagado") 
                Swal.fire({
                    title: "Éxito",
                    text: "Trámite pagado",
                    icon: "success",
                    timer: 1000
                });
                actualizarLista();
                return true;
            })
            .catch(error => {
                console.log("Error : ", error)
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
            
        } else {
            console.log("Ya se pagó el trámite");
            Swal.fire({
                title: "Trámite ya pagado",
                timer: 1000
            });
            return true;
        }
    }

    const handleSaveClick = () => {
        Swal.fire({
            title: "Esta acción no se puede revertir ¿Estás seguro?",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
        }).then((result) => {
            if (result.isConfirmed) {
                actualizarAPagado();
            }
        });
    };

    return(
        <tr key={idT}>
            <td>{folioT}</td>
            <td>{nombreAlm} {apellidoP} {apellidoM}</td>
            <td>{gradoAlm}</td>
            <td>{grupoAlm}</td>
            <td>{conceptoT}</td>
            <td>{montoT}</td>
            <td>{fechaFormateada}</td>
            <td>{estatusTramiteT}</td>
            <td><button onClick={handleSaveClick}>Pagar</button></td>
        </tr>
    );
}