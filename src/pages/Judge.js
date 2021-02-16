import React from "react";
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import axios from "axios"
import { base_url } from "../config";
import $ from "jquery"

export default class Judge extends React.Component{
    constructor(){
        super()
        this.state = {
            token: "",
            judges: [],
            judge: {
                action: "",
                judge_id: "",
                judge_name: "",
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

    getJudges = () => {
        let url = base_url + "/judge"
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {
                this.setState({judges: response.data})    
            }
            
        })
        .catch(e => console.log(e.message))
    }

    addJudge = () => {
        $("#judge_modal").modal("show")
        this.setState({
            judge : {
                action: "insert",
                judge_id: "",
                judge_name: "",
                username: "",
                password: "",
                changePassword: true,
            }
        })
    }

    editJudge = (a) => {
        $("#judge_modal").modal("show")
        this.setState({
            judge: {
                action: "update",
                judge_id: a.judge_id,
                judge_name: a.judge_name,
                username: a.username,
                password: "",
                changePassword: false,
            }
        })
    }

    saveJudge = event => {
        event.preventDefault()
        $("#judge_modal").modal('hide')
        let url = base_url + "/judge-save"
        let form = new FormData()
        form.append("action", this.state.judge.action)
        form.append("judge_id", this.state.judge.judge_id)
        form.append("judge_name", this.state.judge.judge_name)
        form.append("username", this.state.judge.username)

        if (this.state.judge.changePassword) {
            form.append("password", this.state.judge.password)
        }

        axios.post(url, form, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                window.alert(response.data.message)
                this.getJudges()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
    }

    dropJudge = a => {
        if (window.confirm(`Are you sure will delete ${a.judge_name}`)) {
            let url = base_url + "/judge/drop/" + a.judge_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getJudges()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        }
    }

    setPassword = () => {
        if (this.state.judge.action === "update" && this.state.judge.changePassword === false) {
            return (
                <button className="mb-1 btn btn-block btn-dark"
                onClick={() => this.setState({judge:{ ...this.state.judge, changePassword:true}})}>
                    <span className="fa fa-key"></span> Change Password
                </button>
            )
        } else {
            return (
                <div>
                    Password
                    <input type="password" className="form-control mb-1" required
                    value={this.state.judge.password}
                    onChange={e => this.setState({judge:{ ...this.state.judge,password:e.target.value}})}
                    />
                </div>
            )
        }
    }

    infoCountExams = count => {
        if (count === 0) {
            return (
                <i className="text-warning">List of judges is empty.</i>
            )
        }else{
            return null
        }
    }
    
    componentDidMount(){
        this.getJudges()
    }

    render(){
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="card my-2">
                        <div className="card-header bg-dark">
                            <h5 className="text-white">
                                <span className="fa fa-user"></span> Judge List
                            </h5>
                        </div>
                        <div className="card-body">
                            <button className="my-2 btn btn-sm btn-success" onClick={() => this.addJudge()}>
                                <span className="fa fa-plus"></span> New Judge
                            </button>
                            <br />
                            {this.infoCountExams(this.state.judges.length)}
                            {this.state.judges.map(adm => (
                                <div className="card" key={adm.judge_id}>
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-lg-5 col-sm-12">
                                            <small className="text-info">Name</small><br />
                                                <strong>{adm.judge_name}</strong>
                                            </div>
                                            <div className="col-lg-4 col-sm-12">
                                                <small className="text-info">Username</small>
                                                <h6>{adm.username}</h6>
                                            </div>
                                            <div className="col-lg-3 col-sm-12">
                                                <small className="text-info">Action</small> <br />
                                                <button className="mx-1 btn btn-sm btn-info"
                                                onClick={() => this.editJudge(adm)}>
                                                    <span className="fa fa-edit"></span>
                                                </button>
                                                <button className="mx-1 btn btn-sm btn-danger"
                                                onClick={() => this.dropJudge(adm)}>
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
                {/* judge modal */}
                <Modal id="judge_modal" title="Judge Form"
                colorHeader="white" bgHeader="info" size="md">
                    <form onSubmit={ev => this.saveJudge(ev)}>
                        Judge Name
                        <input type="text" className="form-control mb-1" required
                        value={this.state.judge.judge_name}
                        onChange={e => this.setState({judge:{ ...this.state.judge,judge_name:e.target.value}})}
                        />

                        Username
                        <input type="text" className="form-control mb-1" required
                        value={this.state.judge.username}
                        onChange={e => this.setState({judge:{ ...this.state.judge,username:e.target.value}})}
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