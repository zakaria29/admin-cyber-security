import React from "react"
import {Link} from "react-router-dom"
import logo from "../assets/logo.png"

class Navbar extends React.Component{
    Logout = () => {
        localStorage.removeItem("csrf_code")
        localStorage.removeItem("admin")
        // window.location = "/login"
    }
    render(){
        return(
            <div className="navbar navbar-expand-lg navbar-light"
            style={{background:"#00a8a8"}}>
                <a className="navbar-brand">
                    <img src={logo} width="50" className="img mr-2" alt="LKS SMK" />
                    <strong className="text-white">LKS SMK KOTA MALANG</strong>
                </a>

                {/* show and hide menu */}
                <button className="navbar-toggler" data-toggle="collapse"
                data-target="#menu">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* menu */}
                
                <div id="menu" className="navbar-collapse collpase">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link text-white">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/school" className="nav-link text-white">
                                School
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/category" className="nav-link text-white">
                                Categories
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/exam" className="nav-link text-white">
                                Exams
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link text-white dropdown-toggle" href="#" aria-expanded="false"
                            id="navDrop" role="button" data-toggle="dropdown" aria-haspopup="true">
                                Users
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navDrop">
                                <Link to="/admin" className="dropdown-item">
                                    Admin
                                </Link>
                                <Link to="/judge" className="dropdown-item">
                                    Judge
                                </Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/login" onClick={() => this.Logout()}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default Navbar;