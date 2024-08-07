import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModalPersonal.css' // Importa la hoja de estilos
//import Logo2 from './AssetsDAlumn/Logo2.png';
import { FaUserEdit } from "react-icons/fa";

export default function ModalPersonal ({idEmploye, autentificacion}){
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const imprimirDatosDelEmpleado = () => {
        const token = localStorage.getItem('token');
        const url = `https://saiemapi.integrador.xyz/empleados/viewSpecificEmploye`

        fetch(`${url}/${idEmploye}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
              throw new Error('Error al imprimir los datos del empleado: ' + response.status);
            }
            return response.json();
        })
        .then(response => {
            setData(response[0]); // Ajuste aquí para asegurar que data sea un objeto
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setError(error.message);
            autentificacion();
        });
    }

    useEffect(() => {
        if (open) {
            imprimirDatosDelEmpleado();
        }
    }, [open]);

    const tipoUsuario = localStorage.getItem('typeUser');
    if(tipoUsuario == "employe"){
        return (
        <div>
            <Button onClick={handleOpen}> <FaUserEdit /> </Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="modal-box">
                    <header className='header'>
                        <h1>Datos del Empleado</h1>
                    </header>
                    <br />
                    {error && <p>Error: {error}</p>}
                    {!error && data && (
                        <div>
                                <p>Nombre: {data.nombre || "N/A"} {data.apellido_p || "N/A"} {data.apellido_m || "N/A"}</p>
                                <p>Telefono: {data.telefono || "N/A"}</p>
                                <p>Correo: {data.correo || "N/A"}</p>
                                <p>CURP: {data.curp || "N/A"}</p>
                                <p>Estatus: {data.tipo_estatus || "N/A"}</p>
                                <p>Area: {data.nombre_area || "N/A"}</p>
                                <p>Cargo: {data.nombre_cargo || "N/A"}</p>

                        </div>
                    )}
                    <Button className='CloseA' onClick={handleClose}>Cerrar</Button>
                </Box>
            </Modal>
        </div>
        );
    }

    return (
        <div>
            <Button onClick={handleOpen}> <FaUserEdit /> </Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="modal-box">
                    <header className='header'>
                        <h1>Datos del Empleado</h1>
                    </header>
                    {error && <p>Error: {error}</p>}
                    {!error && data && (
                        <div>
                            <br />
                                <p>Nombre: {data.nombre || "N/A"} {data.apellido_p || "N/A"} {data.apellido_m || "N/A"}</p>
                                <p>Telefono: {data.telefono || "N/A"}</p>
                                <p>Correo: {data.correo || "N/A"}</p>
                                <p>CURP: {data.curp || "N/A"}</p>
                                <p>Estatus: {data.tipo_estatus || "N/A"}</p>
                                <p>Area: {data.nombre_area || "N/A"}</p>
                                <p>Cargo: {data.nombre_cargo || "N/A"}</p>
                                <p>Sueldo: {data.sueldoHora || "N/A"}</p>
                                <br />

                                <Button className='EditA' onClick={() => navigate('/editEmpleado', { state: { data } })}>
                                    Editar
                                </Button>
                        </div>
                    )}
                    <Button className='CloseA' onClick={handleClose}>Cerrar</Button>
                </Box>
            </Modal>
        </div>
    );
}