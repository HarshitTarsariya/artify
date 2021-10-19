import React from 'react'
import photo from '../photo.png'

export default function Header({account}) {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            rel="noopener noreferrer"
            >
                <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
                artify        
            </a>
            {account?
                <div style={{color:'green'}}>Welcome , <b>{account}</b></div>:
                <span></span>
            }
      </nav>
    )
}
