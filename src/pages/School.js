import React from "react";
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import axios from "axios"
import SchoolList from "../components/SchoolList"
import { base_url } from "../config";
import $ from "jquery"

export default class School extends React.Component{
    constructor(){
        super();
        this.state = {
            schools: [],
            token: "",
            school: {
                action: "",
                school_id: "",
                school_name: "",
                school_address: ""
            },
            team: {
                action: "",
                team_id: "",
                team_name: "",
                school_id: "",
                school_name: ""
            },
            member: {
                action: "",
                member_name: "",
                team_id: "",
                team_name: "",
                email: "",
                username: "",
                password: "",
                changePassword: true
            }
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

    getSchools = () => {
        let url = base_url + "/school"
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {
                this.setState({schools: response.data})    
            }
            
        })
        .catch(e => console.log(e.message))
    }

    addSchool = () => {
       $("#school_modal").modal('show')
       this.setState({
           school: {
               action: "insert",
               school_id: "",
               school_name: "",
               school_address: ""
           }
       })
    }

    editSchool = (s) => {
        $("#school_modal").modal('show')
       this.setState({
           school: {
               action: "update",
               school_id: s.school_id,
               school_name: s.school_name,
               school_address: s.school_address
           }
       })
    }

    saveSchool = (event) => {
        event.preventDefault()
        $("#school_modal").modal('hide')
        let url = base_url + "/school-save"
        let form = new FormData()
        form.append("action", this.state.school.action)
        form.append("school_id", this.state.school.school_id)
        form.append("school_name", this.state.school.school_name)
        form.append("school_address", this.state.school.school_address)

        axios.post(url, form, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                window.alert(response.data.message)
                this.getSchools()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
    }

    dropSchool = s => {
        if (window.confirm('All team in this school will be delete, are you sure?')) {
            let url = base_url + "/school/drop/" + s.school_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getSchools()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        }
    }

    addTeam = (s) => {
        $("#team_modal").modal('show')
        this.setState({
            team: {
                action: "insert",
                team_id: "",
                team_name: "",
                school_id: s.school_id,
                school_name: s.school_name
            }
        })
     }
 
     editTeam = (t,s) => {
         $("#team_modal").modal('show')
        this.setState({
            team: {
                action: "update",
                team_id: t.team_id,
                team_name: t.team_name,
                school_id: t.school_id,
                school_name: s
            }
        })
     }
 
     saveTeam = (event) => {
         event.preventDefault()
         $("#team_modal").modal('hide')
         let url = base_url + "/team-save"
         let form = new FormData()
         form.append("action", this.state.team.action)
         form.append("team_id", this.state.team.team_id)
         form.append("team_name", this.state.team.team_name)
         form.append("school_id", this.state.team.school_id)
 
         axios.post(url, form, this.headerConfig())
         .then(response => {
             let status = response.data.status
             if (status) {
                 window.alert(response.data.message)
                 this.getSchools()
             } else {
                 window.alert(response.data.message)
             }
         })
         .catch(e => console.log(e.message))
     }
 
     dropTeam = t => {
         if (window.confirm('All member in this team will be delete, are you sure?')) {
             let url = base_url + "/team/drop/" + t.team_id
             axios.delete(url, this.headerConfig())
             .then(response => {
                 let status = response.data.status
                 if (status) {
                     window.alert(response.data.message)
                     this.getSchools()
                 } else {
                     window.alert(response.data.message)
                 }
             })
             .catch(e => console.log(e.message))
         }
     }

     addMember = (t) => {
        $("#member_modal").modal('show')
        this.setState({
            member: {
                action: "insert",
                member_id: "",
                member_name: "",
                team_id: t.team_id,
                username: "",
                password: "",
                email: "",
                changePassword: true,
                team_name: t.team_name
            }
        })
     }
 
     editMember = (m,t) => {
         $("#member_modal").modal('show')
        this.setState({
            member: {
                action: "update",
                member_id: m.member_id,
                member_name: m.member_name,
                team_id: m.team_id,
                username: m.username,
                password: "",
                email: m.email,
                changePassword: false,
                team_name: t
            }
        })
     }
 
     saveMember = (event) => {
         event.preventDefault()
         $("#member_modal").modal('hide')
         let url = base_url + "/member-save"
         let form = new FormData()
         form.append("action", this.state.member.action)
         form.append("member_id", this.state.member.member_id)
         form.append("member_name", this.state.member.member_name)
         form.append("team_id", this.state.member.team_id)
         form.append("email", this.state.member.email)
         form.append("username", this.state.member.username)

         if(this.state.member.changePassword === true){
            form.append("password", this.state.member.password)
         }
 
         axios.post(url, form, this.headerConfig())
         .then(response => {
             let status = response.data.status
             if (status) {
                 window.alert(response.data.message)
                 this.getSchools()
             } else {
                 window.alert(response.data.message)
             }
         })
         .catch(e => console.log(e.message))
     }
 
     dropMember = m => {
         if (window.confirm('Are you sure will delete this member?')) {
             let url = base_url + "/member/drop/" + m.member_id
             axios.delete(url, this.headerConfig())
             .then(response => {
                 let status = response.data.status
                 if (status) {
                     window.alert(response.data.message)
                     this.getSchools()
                 } else {
                     window.alert(response.data.message)
                 }
             })
             .catch(e => console.log(e.message))
         }
     }
    
    setPassword = () => {
        if (this.state.member.action === "update" && this.state.member.changePassword === false) {
            return (
                <button className="mb-1 btn btn-block btn-dark"
                onClick={() => this.setState({member:{ ...this.state.member, changePassword:true}})}>
                    <span className="fa fa-key"></span> Change Password
                </button>
            )
        } else {
            return (
                <div>
                    Password
                    <input type="password" className="form-control mb-1" required
                    value={this.state.member.password}
                    onChange={e => this.setState({member:{ ...this.state.member,password:e.target.value}})}
                    />
                </div>
            )
        }
    }

    componentDidMount(){
        this.getSchools()
    }

    

    render(){
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="card my-2">
                        <div className="card-header bg-success">
                            <h5 className="text-white">
                            <span className="fa fa-school mr-2"></span>
                                List of School
                            </h5>
                        </div>
                        <div className="card-body">
                            <button className="mb-2 btn btn-sm btn-info" onClick={() => this.addSchool()}>
                                <span className="fa fa-plus"></span> New School
                            </button>
                            <div id="accordion">
                                {this.state.schools.map(school => (
                                    <SchoolList 
                                    key={school.school_id}
                                    parent="accordion"
                                    id={school.school_id}
                                    schoolName={school.school_name}
                                    schoolAddress={school.school_address}
                                    onSchoolEdit={() => this.editSchool(school)}
                                    onSchoolDrop={() => this.dropSchool(school)}
                                    teamList={school.teams}
                                    onTeamAdd={() => this.addTeam(school)}
                                    onTeamEdit={(team,sch) => this.editTeam(team,sch)}
                                    onTeamDrop={team => this.dropTeam(team)}
                                    onMemberAdd={team => this.addMember(team)}
                                    onMemberEdit={(member,tm) => this.editMember(member,tm)}
                                    onMemberDrop={member => this.dropMember(member)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* school modal */}
                <Modal id="school_modal" title="School Form"
                colorHeader="white" bgHeader="info" size="md">
                    <form onSubmit={ev => this.saveSchool(ev)}>
                        School Name
                        <input type="text" className="form-control mb-1" required
                        value={this.state.school.school_name}
                        onChange={e => this.setState({school:{ ...this.state.school,school_name:e.target.value}})}
                        />

                        School Address
                        <input type="text" className="form-control mb-1" required
                        value={this.state.school.school_address}
                        onChange={e => this.setState({school:{ ...this.state.school,school_address:e.target.value}})}
                        />

                        <button type="submit" className="btn btn-block btn-sm btn-info">
                            Save
                        </button>
                    </form>
                </Modal>

                {/* team modal */}
                <Modal id="team_modal" title="Team Form"
                colorHeader="white" bgHeader="success" size="md">
                    <strong className="mb-2 text-info">
                        <i>Team of {this.state.team.school_name}</i>
                    </strong>
                    <form onSubmit={ev => this.saveTeam(ev)}>
                        Team Name
                        <input type="text" className="form-control mb-1" required
                        value={this.state.team.team_name}
                        onChange={e => this.setState({team:{ ...this.state.team,team_name:e.target.value}})}
                        />

                        <button type="submit" className="btn btn-block btn-sm btn-success">
                            Save
                        </button>
                    </form>
                </Modal>

                {/* member modal */}
                <Modal id="member_modal" title="Member Form"
                colorHeader="white" bgHeader="success" size="md">
                    <strong className="mb-2 text-info">
                        <i>Member of {this.state.member.team_name}</i>
                    </strong>
                    <form onSubmit={ev => this.saveMember(ev)}>
                        Member Name
                        <input type="text" className="form-control mb-1" required
                        value={this.state.member.member_name}
                        onChange={e => this.setState({member:{ ...this.state.member,member_name:e.target.value}})}
                        />
                        
                        Email
                        <input type="text" className="form-control mb-1" required
                        value={this.state.member.email}
                        onChange={e => this.setState({member:{ ...this.state.member,email:e.target.value}})}
                        />

                        Username
                        <input type="text" className="form-control mb-1" required
                        value={this.state.member.username}
                        onChange={e => this.setState({member:{ ...this.state.member,username:e.target.value}})}
                        />

                        {this.setPassword()}

                        <button type="submit" className="btn btn-block btn-sm btn-success">
                            Save
                        </button>
                    </form>
                </Modal>
            </div>
        )
    }
}