import React from 'react'
import logoImg from './1.jpg'
import './logo.css' 
class Logo extends React.Component{
    render(){
        return(
            <div className="logo-container">
                <img src={logoImg} alt="logo"/>
            </div>
        )
    }
} 

export default Logo