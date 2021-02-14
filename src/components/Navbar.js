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
                    LKS SMK KOTA MALANG
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
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/school" className="nav-link">
                                School
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/category" className="nav-link">
                                Categories
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/exam" className="nav-link">
                                Exams
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin" className="nav-link">
                                Administrator
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login" onClick={() => this.Logout()}>
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