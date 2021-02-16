import React from "react";
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import axios from "axios"
import { base_url } from "../config";
import $ from "jquery"

export default class Admin extends React.Component{
    constructor(){
        super()
        this.state = {
            token: "",
            admins: [],
            admin: {
                action: "",
                admin_id: "",
                admin_name: "",
                username: "",
                password: "",
                changePassword: "",
            },
        }

        if (localStorage.getItem("csrf_code")) {
            this.state.token = localStorage.getItem("csrf_code")
        } else {
            window.location = "/login"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getAdmins = () => {
        let url = base_url + "/admin"
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {
                this.setState({admins: response.data})    
            }
            
        })
        .catch(e => console.log(e.message))
    }

    addAdmin = () => {
        $("#admin_modal").modal("show")
        this.setState({
            admin : {
                action: "insert",
                admin_id: "",
                admin_name: "",
                username: "",
                password: "",
                changePassword: true,
            }
        })
    }

    editAdmin = (a) => {
        $("#admin_modal").modal("show")
        this.setState({
            admin: {
                action: "update",
                admin_id: a.admin_id,
                admin_name: a.admin_name,
                username: a.username,
                password: "",
                changePassword: false,
            }
        })
    }

    saveAdmin = event => {
        event.preventDefault()
        $("#admin_modal").modal('hide')
        let url = base_url + "/admin-save"
        let form = new FormData()
        form.append("action", this.state.admin.action)
        form.append("admin_id", this.state.admin.admin_id)
        form.append("admin_name", this.state.admin.admin_name)
        form.append("username", this.state.admin.username)

        if (this.state.admin.changePassword) {
            form.append("password", this.state.admin.password)
        }

        axios.post(url, form, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                window.alert(response.data.message)
                this.getAdmins()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
    }

    dropAdmin = a => {
        if (window.confirm(`Are you sure will delete ${a.admin_name}`)) {
            let url = base_url + "/admin/drop/" + a.admin_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getAdmins()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        }
    }

    setPassword = () => {
        if (this.state.admin.action === "update" && this.state.admin.changePassword === false) {
            return (
                <button className="mb-1 btn btn-block btn-dark"
                onClick={() => this.setState({admin:{ ...this.state.admin, changePassword:true}})}>
                    <span className="fa fa-key"></span> Change Password
                </button>
            )
        } else {
            return (
                <div>
                    Password
                    <input type="password" className="form-control mb-1" required
                    value={this.state.admin.password}
                    onChange={e => this.setState({admin:{ ...this.state.admin,password:e.target.value}})}
                    />
                </div>
            )
        }
    }

    infoCountExams = count => {
        if (count === 0) {
            return (
                <i className="text-warning">List of admins is empty.</i>
            )
        }else{
            return null
        }
    }
    
    componentDidMount(){
        this.getAdmins()
    }

    render(){
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="card my-2">
                        <div className="card-header bg-danger">
                            <h5 className="text-white">
                                <span className="fa fa-user"></span> Admin List
                            </h5>
                        </div>
                        <div className="card-body">
                            <button className="my-2 btn btn-sm btn-success" onClick={() => this.addAdmin()}>
                                <span className="fa fa-plus"></span> New Admin
                            </button>
                            <br />
                            {this.infoCountExams(this.state.admins.length)}
                            {this.state.admins.map(adm => (
                                <div className="card" key={adm.admin_id}>
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-lg-5 col-sm-12">
                                            <small className="text-info">Name</small><br />
                                                <strong>{adm.admin_name}</strong>
                                            </div>
                                            <div className="col-lg-4 col-sm-12">
                                                <small className="text-info">Username</small>
                                                <h6>{adm.username}</h6>
                                            </div>
                                            <div className="col-lg-3 col-sm-12">
                                                <small className="text-info">Action</small> <br />
                                                <button className="mx-1 btn btn-sm btn-info"
                                                onClick={() => this.editAdmin(adm)}>
                                                    <span className="fa fa-edit"></span>
                                                </button>
                                                <button className="mx-1 btn btn-sm btn-danger"
                                                onClick={() => this.dropAdmin(adm)}>
                                                    <span className="fa fa-trash"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
                {/* admin modal */}
                <Modal id="admin_modal" title="Admin Form"
                colorHeader="white" bgHeader="info" size="md">
                    <form onSubmit={ev => this.saveAdmin(ev)}>
                        Admin Name
                        <input type="text" className="form-control mb-1" required
                        value={this.state.admin.admin_name}
                        onChange={e => this.setState({admin:{ ...this.state.admin,admin_name:e.target.value}})}
                        />

                        Username
                        <input type="text" className="form-control mb-1" required
                        value={this.state.admin.username}
                        onChange={e => this.setState({admin:{ ...this.state.admin,username:e.target.value}})}
                        />

                        {this.setPassword()}

                        <button className="btn btn-sm btn-info btn-block" type="submit">
                            Save
                        </button>
                    </form>
                </Modal>
            </div>
        )
    }
}