import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 SAIEM.    Todos los derechos reservados.  Carlos  Molina Mendoza, Adrian Sánchez Garcia, Diego Jimenez Perez.</p>
        <nav className="footer-nav">
          <ul>
            <li><a href="#about">Acerca de</a></li>
            <li><a href="#services">Servicios</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
