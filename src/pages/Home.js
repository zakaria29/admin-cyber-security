import React from "react"
import Navbar from "../components/Navbar"
import Card from "../components/Card"
import axios from "axios"
import { base_url } from "../config"

export default class Home extends React.Component{
    constructor(){
        super()
        this.state = {
            token: "",
            countSchools: 0,
            countTeams: 0,
            countMembers: 0,
            countExams: 0,
            countCategories: 0,
            countQuestions: 0
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

    initCount = () => {
        axios.get(base_url + "/school", this.headerConfig())
        .then(response => {
            this.setState({countSchools: response.data.length})
        })
        .catch(error => console.log(error))

        axios.get(base_url + "/team", this.headerConfig())
        .then(response => {
            this.setState({countTeams: response.data.length})
        })
        .catch(error => console.log(error))

        axios.get(base_url + "/member", this.headerConfig())
        .then(response => {
            this.setState({countMembers: response.data.length})
        })
        .catch(error => console.log(error))

        axios.get(base_url + "/exam", this.headerConfig())
        .then(response => {
            this.setState({countExams: response.data.length})
        })
        .catch(error => console.log(error))

        axios.get(base_url + "/question", this.headerConfig())
        .then(response => {
            this.setState({countQuestions: response.data.length})
        })
        .catch(error => console.log(error))

        axios.get(base_url + "/category", this.headerConfig())
        .then(response => {
            this.setState({countCategories: response.data.length})
        })
        .catch(error => console.log(error))
    }

    componentDidMount(){
        this.initCount()
    }

    render(){
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="row my-4">
                        <Card 
                        className="mt-4 col-lg-4 col-md-6 col-sm-12"
                        icon="fa fa-school" iconColor="info"
                        count={this.state.countSchools} label="Schools"
                        />

                        <Card 
                        className="mt-4 col-lg-4 col-md-6 col-sm-12"
                        icon="fa fa-user-friends" iconColor="warning"
                        count={this.state.countTeams} label="Teams"
                        />

                        <Card 
                        className="mt-4 col-lg-4 col-md-6 col-sm-12"
                        icon="fa fa-users" iconColor="primary"
                        count={this.state.countMembers} label="Participants"
                        />

                        <Card 
                        className="mt-4 col-lg-4 col-md-6 col-sm-12"
                        icon="fa fa-file" iconColor="danger"
                        count={this.state.countExams} label="Exams"
                        />

                        <Card 
                        className="mt-4 col-lg-4 col-md-6 col-sm-12"
                        icon="fa fa-asterisk" iconColor="secondary"
                        count={this.state.countCategories} label="Categories"
                        />

                        <Card 
                        className="mt-4 col-lg-4 col-md-6 col-sm-12"
                        icon="fa fa-question" iconColor="success"
                        count={this.state.countQuestions} label="Questions"
                        />

                    </div>
                </div>
            </div>
        );
    }
}