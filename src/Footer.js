import React from 'react';
import './Footer.css';
import { FaYoutube /*, FaTelegram, FaGithub */ } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">© {new Date().getFullYear()} PoluxDev. Todos los derechos reservados.</p>
      <div className="social-icons">
        <a
          href="https://www.youtube.com/@BinaryVG"
          target="_blank"
          rel="noopener noreferrer"
          className="youtube"
        >
          <FaYoutube /> Suscríbete
        </a>

        {/* 
        <a
          href="https://t.me/tu_canal_telegram"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram"
        >
          <FaTelegram /> Únete al canal 
        </a>

        <a
          href="https://github.com/poluxdev"
          target="_blank"
          rel="noopener noreferrer"
          className="github"
        >
          <FaGithub /> GitHub
        </a>
        */}
      </div>
    </footer>
  );
};

export default Footer;
