import React from "react"
import axios from "axios"
import { base_url } from "../config";
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import ExamList from "../components/ExamList"
import $ from "jquery"
import ApexCharts from "apexcharts";

export default class Exam extends React.Component{
    constructor(){
        super()
        this.state = {
            token: "",
            exams: [],
            exam: {
                action: "",
                exam_id: "",
                exam_name: "",
                status: ""
            },
            activeCategory: [],
            showCategory: [],
            selectedCategory: [],
            selectedExamID: "",
            selectedExamName: "",
            results:[],
            teams: []
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

    infoCountExams = count => {
        if (count === 0) {
            return (
                <i className="text-warning">List of exams is empty.</i>
            )
        }else{
            return null
        }
    }

    getExams = () => {
        let url = base_url + "/exam"
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {
                this.setState({exams: response.data})    
            }
            
        })
        .catch(e => console.log(e.message))
    }

    getTeams = () => {
        let url = base_url + "/team"
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {
                this.setState({teams: response.data})    
            }
            
        })
        .catch(e => console.log(e.message))
    }

    addExam = () => {
        $("#exam_modal").modal("show")
        this.setState({
            exam: {
                action: "insert",
                exam_id: "",
                exam_name: "",
                status: 1
            }
        })
    }

    editExam = c => {
        $("#exam_modal").modal("show")
        this.setState({
            exam: {
                action: "update",
                exam_id: c.exam_id,
                exam_name: c.exam_name,
                status: c.status
            }
        })
    }

    saveExam = (event) => {
        event.preventDefault()
        $("#exam_modal").modal('hide')
        let url = base_url + "/exam-save"
        let form = new FormData()
        form.append("action", this.state.exam.action)
        form.append("exam_id", this.state.exam.exam_id)
        form.append("exam_name", this.state.exam.exam_name)
        form.append("status", this.state.exam.status)

        axios.post(url, form, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                window.alert(response.data.message)
                this.getExams()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
    }

    dropExam = s => {
        if (window.confirm('Are you sure will delete this exam?')) {
            let url = base_url + "/exam/drop/" + s.exam_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getExams()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        }
    }

    refreshToken = e => {
        let url = base_url + "/refresh-token/" + e.exam_id
        axios.get(url, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                // window.alert(response.data.message)
                this.getExams()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
    }

    getActiveCategory = () => {
        let url = base_url + "/active-category"
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {
                this.setState({activeCategory: response.data})    
            }
            
        })
        .catch(e => console.log(e.message))
    }

    bindSelectedCategory = (e) => {
        $("#category_modal").modal("show")
        let active = this.state.activeCategory
        let selected = []
        e.exam_category.map(ex => {
            selected.push(ex.category_id)
        })
        

        for (let index = 0; index < active.length; index++) {
            if (selected.includes(active[index].category_id)) {
                active[index].checked = true
            } else {
                active[index].checked = false
            }            
        }
        this.setState({
            showCategory: active,
            selectedCategory: selected,
            selectedExamID: e.exam_id,
            selectedExamName: e.exam_name
        })
        
    }

    choose = (ac,i) => {
        let temp = this.state.selectedCategory
        let show = this.state.showCategory
        let index = temp.findIndex(it => it === ac.category_id)
        if (index < 0) {
            temp.push(ac.category_id)
            show[i].checked = true
        } else {
            temp.splice(index, 1)
            show[i].checked = false
        }
        
        
        this.setState({selectedCategory: temp, showCategory: show})
    }

    saveExamCategory = ev => {
        ev.preventDefault()
        $("#category_modal").modal("hide")
        let url = base_url + "/exam-category/save"
        let form = new FormData()
        form.append("exam_category", JSON.stringify(this.state.selectedCategory))
        form.append("exam_id", this.state.selectedExamID)

        axios.post(url, form, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                window.alert(response.data.message)
                this.getExams()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
        
    }

    resetExam = (e, team) => {
        if (window.confirm(`Are you sure will reset ${e.exam_name} for ${team.team_name}?`)) {
            let url = base_url + "/reset-exam"
            let form = new FormData()
            form.append("exam_id", e.exam_id)
            form.append("team_id", team.team_id)

            axios.post(url, form, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getExams()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))   
        }        
    }

    componentDidMount(){
        this.getExams()
        this.getActiveCategory()
        this.getTeams()
    }

    getResult = ex => {
        $("#score_modal").modal("show")
        let url = base_url + "/get-score/" + ex.exam_id
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {    
                let data = response.data
                let yData = []
                let xData = []
                let total = 0
                if(data.length > 0){
                    this.setState({
                        results: response.data[0].exam_details,
                        exam: {...this.state.exam, exam_name: ex.exam_name}
                    })
                    data[0].exam_details.map(d => {
                        xData.push(d.team.team_name)
                        total = 0
                        d.exam_details.map(c => {
                            total += c.score
                        })
                        yData.push(total)
                    })
                }
                var options = {
                    chart: {
                        type: 'bar',
                        height:200
                    },
                    series: [{
                        name: 'score',
                        data: yData
                    }],
                    plotOptions:{
                        bar: {
                            horizontal:true
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: xData
                    }
                }
                document.querySelector("#lineChart").innerHTML = ""
                var chart = new ApexCharts(document.querySelector("#lineChart"), options);
                
                chart.render();
            }
            
        })
        .catch(e => console.log(e.message))
    }

    render(){
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="card my-2">
                        <div className="card-header bg-warning">
                            <h5 className="text-white">
                                <span className="fa fa-file"></span> List of Exams
                            </h5>
                        </div>
                        <div className="card-body">
                            <button className="mb-2 btn btn-sm btn-success" onClick={() => this.addExam()}>
                                <span className="fa fa-plus"></span> New Exam
                            </button>
                            <br />
                            {this.infoCountExams(this.state.exams.length)}
                            {this.state.exams.map(e => (
                                <ExamList 
                                key={e.exam_id}
                                examName={e.exam_name}
                                examStatus={e.status}
                                examToken={e.token}
                                examID={e.exam_id}
                                onExamEdit={() => this.editExam(e)}
                                onExamDrop={() => this.dropExam(e)}
                                onRefreshToken={() => this.refreshToken(e)}
                                onSetCategory={() => this.bindSelectedCategory(e)}
                                getResult={() => this.getResult(e)}
                                teamList={this.state.teams}
                                onResetExam={team => this.resetExam(e, team)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* exam modal */}
                <Modal id="exam_modal" title="Exam Form"
                colorHeader="white" bgHeader="info" size="md">
                    <form onSubmit={ev => this.saveExam(ev)}>
                        Exam Name
                        <input type="text" className="form-control mb-1" required
                        value={this.state.exam.exam_name}
                        onChange={e => this.setState({exam:{ ...this.state.exam,exam_name:e.target.value}})}
                        />

                        Status
                        <select className="form-control mb-1" required
                        value={this.state.exam.status}
                        onChange={e => this.setState({exam:{ ...this.state.exam,status:e.target.value}})}>
                            <option value="1">Active</option>
                            <option value="0">Deactive</option>
                        </select>

                        <button type="submit" className="mt-2 btn btn-block btn-sm btn-info">
                            Save
                        </button>
                    </form>
                </Modal>

                {/* category modal */}
                <Modal id="category_modal" title="Select Category"
                colorHeader="white" bgHeader="info" size="md">
                    <form onSubmit={ev => this.saveExamCategory(ev)}>
                        <small className="text-info">Exam Name</small>
                        <h6>{this.state.selectedExamName}</h6>
                        <small>Select Category for this exam</small> <br />
                        <ul className="list-group">
                            {this.state.showCategory.map((ac, index) => (
                                <li key={`AC${index}`} className="list-group-item">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                        checked={ac.checked}
                                        onChange={ev => this.choose(ac, index)}
                                        id={`default${index}`} />
                                        <label htmlFor={`default${index}`}>
                                            {ac.category_name}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button type="submit" className="mt-2 btn btn-block btn-sm btn-info">
                            Save
                        </button>
                    </form>                   
                </Modal>

                {/* score modal */}
                <Modal id="score_modal" title="Scoring Board"
                colorHeader="white" bgHeader="info" size="lg">
                    <h5 className="mx-2">
                        Scoring Board of {this.state.exam.exam_name}
                        {/* <LineChart dataSource={this.state.scores} /> */}
                        <div id="lineChart"></div>
                        <div className="card mt-2">
                            <ul className="list-group">
                                {this.state.results.map(res => (
                                    <li className="list-group-item" key={res.do_exam_id}>
                                        <h6>{res.team.team_name}</h6>
                                        <ul>
                                            {res.exam_details.map((it, index) => (
                                                <li key={`${index}${it.do_exam_id}`}>
                                                    <div className="row">
                                                        <div className="col-sm-9">
                                                            <small>
                                                                {it.category.category_name}
                                                            </small>
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <small>
                                                                {it.score} points
                                                            </small>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </h5>
                </Modal>
            </div>
        )
    }
}