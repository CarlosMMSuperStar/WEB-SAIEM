import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModalProfesor.css' // Importa la hoja de estilos
import { FaUserEdit } from "react-icons/fa";

export default function ModalProfesor ({idTeacher, autenticacion}){
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [dataMat, setDataMat] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const imprimirDatosDelProfesor = () => {
        const url = `https://saiemapi.integrador.xyz/empleados/viewSpecificTeacher`
        const token = localStorage.getItem('token');

        fetch(`${url}/${idTeacher}`, {
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
            setData(response[0]);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setError(error.message);
            autenticacion()
        });
        imprimirMateriasDelProfesor();
    }

    const imprimirMateriasDelProfesor = () => {
        const url = `https://saiemapi.integrador.xyz/empleados/showMat`
        const token = localStorage.getItem('token');

        fetch(`${url}/${idTeacher}`, {
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
            autenticacion()
        });
    }    

    useEffect(() => {
        if (open) {
            imprimirDatosDelProfesor();
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
                        <h1>Datos del Maestro</h1>
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
                                <p>Especialidad: {data.nombre_especialidad || "N/A"}</p>

                                <h5>Materias que imparte:</h5>
                                <ul>
                                    {error && <li>Error: {error}</li>}
                                    {!dataMat.length && <li>No imparte ninguna Materia</li>}
                                    {!error && dataMat.length > 0 && (
                                        dataMat.map((materia, index) => (
                                            <li key={index}>{materia.nombre}</li>
                                        ))
                                    )}
                                </ul>
                                <br />
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
                        <h1>Datos del Maestro</h1>
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
                                <p>Especialidad: {data.nombre_especialidad || "N/A"}</p>
                                <p>Sueldo: {data.sueldoPorHora || "N/A"}</p>
                                <br/>

                                <h5>Materias que imparte:</h5>
                                <br/>
                                <ul>
                                    {error && <li>Error: {error}</li>}
                                    {!dataMat.length && <li>No imparte ninguna Materia</li>}
                                    {!error && dataMat.length > 0 && (
                                        dataMat.map((materia, index) => (
                                            <li key={index}>{materia.nombre}</li>
                                        ))
                                    )}
                                    <br/>
                                </ul>
                                
                                <Button className='EditA' onClick={() => navigate('/editProfesor', { state: { data } })}>
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
