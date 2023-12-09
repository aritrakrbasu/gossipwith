import { faHome, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import React  from 'react'
import logo from '../img/logo.png'
import { Button } from 'react-bootstrap'

function Sidebar() {
    const { logout } = useAuth()
    const history = useHistory()
    async function handleLogout() {    
        try {
          await logout()
          history.push("/")
        } catch {
          console.log("Failed to log out")
        }
      }
    return (
        <div className="sidebar">
            <img src={logo} className="sidebar-brand" alt="logo" />
            <ul className="sidebar-ul">
                <Link to="/dashboard"><li><FontAwesomeIcon icon={faHome}/></li></Link>
                <Link to="/profile"><li><FontAwesomeIcon icon={faUser}/></li></Link>
                <Button variant="light" onClick={handleLogout}><li><FontAwesomeIcon icon={faSignOutAlt}/></li></Button>
            </ul>
        </div>
    )
}

export default Sidebar
