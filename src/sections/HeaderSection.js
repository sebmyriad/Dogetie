import React from 'react'
import '../assets/styles/sections/header.css'
import logo from '../assets/images/coinid-logo.png'
import background from '../assets/images/bg.png'

const HeaderSection = () => (
  <div className="header">
    <img src={background} className="header__background" alt="background" rel="preload" />
    <div className="header__container container">
      <h1 className="header__title">
        DOGECOIN FOR CHARITY  
      </h1>
      <p className="header__intro">
        Every donation will go straight to BlueCross and WFF to help animals in need!
      </p>
    </div>
  </div>
)

export default HeaderSection
