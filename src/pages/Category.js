import React from "react"
import Navbar from "../components/Navbar"
import axios from "axios"
import { base_url } from "../config";
import CategoryList from "../components/CategoryList"
import Modal from "../components/Modal"
import $ from "jquery"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import DragDrop from "../components/DragDrop"

export default class Category extends React.Component{
    constructor(){
        super()
        this.state = {
            categories: [],
            token: "",
            category: {
                action: "",
                category_id: "",
                category_name: "",
                status: true
            },
            question: {
                action: "",
                question_id: "",
                question: "",
                point: "",
                answer_key: "",
                category_id: "",
                category_name: "",
                status: true
            },
            file: {
                files: [],
                question_id: "",
                question: ""
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

    infoCountCategory = count => {
        if (count === 0) {
            return (
                <i className="text-warning">List of categories is empty.</i>
            )
        }else{
            return null
        }
    }

    getCategories = () => {
        let url = base_url + "/category"
        axios.get(url, this.headerConfig())
        .then(response => {
            if (response.data.error) {
                window.alert(response.data.error)
                window.location = "/login"                
            } else {
                this.setState({categories: response.data})    
            }
            
        })
        .catch(e => console.log(e.message))
    }

    addCategory = () => {
        $("#category_modal").modal("show")
        this.setState({
            category: {
                action: "insert",
                category_id: "",
                category_name: "",
                status: 1
            }
        })
    }

    editCategory = c => {
        $("#category_modal").modal("show")
        this.setState({
            category: {
                action: "update",
                category_id: c.category_id,
                category_name: c.category_name,
                status: c.status
            }
        })
    }

    saveCategory = (event) => {
        event.preventDefault()
        $("#category_modal").modal('hide')
        let url = base_url + "/category-save"
        let form = new FormData()
        form.append("action", this.state.category.action)
        form.append("category_id", this.state.category.category_id)
        form.append("category_name", this.state.category.category_name)
        form.append("status", this.state.category.status)

        axios.post(url, form, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                window.alert(response.data.message)
                this.getCategories()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
    }

    dropCategory = s => {
        if (window.confirm('All questions in this category will be delete, are you sure?')) {
            let url = base_url + "/category/drop/" + s.category_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getCategories()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        }
    }

    addQuestion = (c) => {
        $("#question_modal").modal("show")
        this.setState({
            question: {
                action: "insert",
                question_id: "",
                question: "",
                point: 0,
                answer_key: "",
                category_id: c.category_id,
                category_name: c.category_name,
                status: 1
            }
        })
    }

    editQuestion = (q,cN) => {
        $("#question_modal").modal("show")
        this.setState({
            question: {
                action: "update",
                question_id: q.question_id,
                question: q.question,
                point: q.point,
                answer_key: q.answer_key,
                category_id: q.category_id,
                category_name: cN,
                status: q.status
            }
        })
    }

    saveQuestion = (event) => {
        event.preventDefault()
        $("#question_modal").modal('hide')
        let url = base_url + "/question-save"
        let form = new FormData()
        form.append("action", this.state.question.action)
        form.append("question_id", this.state.question.question_id)
        form.append("question", this.state.question.question)
        form.append("point", this.state.question.point)
        form.append("answer_key", this.state.question.answer_key)
        form.append("category_id", this.state.question.category_id)
        form.append("status", this.state.question.status)

        axios.post(url, form, this.headerConfig())
        .then(response => {
            let status = response.data.status
            if (status) {
                window.alert(response.data.message)
                this.getCategories()
            } else {
                window.alert(response.data.message)
            }
        })
        .catch(e => console.log(e.message))
    }

    dropQuestion = s => {
        if (window.confirm('Are you sure will delete this question?')) {
            let url = base_url + "/question/drop/" + s.question_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getCategories()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        }
    }

    addFile = q => {
        $("#file_modal").modal("show")
        this.setState({
            file: {
                files: [],
                question_id: q.question_id,
                question: q.question
            }
        })
    }

    saveFiles = event => {
        event.preventDefault()
        if (this.state.file.files.length > 0) {
            $("#file_modal").modal("hide")
            let url = base_url + "/file/save"
            let form = new FormData()
            form.append("question_id", this.state.file.question_id)
            for (let index = 0; index < this.state.file.files.length; index++) {
                form.append(`files[${index}]`, this.state.file.files[index])                
            }
            axios.post(url, form, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getCategories()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        } else {
            window.alert("No Upload File")
        }
    }

    dropFile = f => {
        if (window.confirm('Are you sure will delete this file?')) {
            let url = base_url + "/file/drop/" + f.file_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                let status = response.data.status
                if (status) {
                    window.alert(response.data.message)
                    this.getCategories()
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch(e => console.log(e.message))
        }
    }

    handleDrop = file => {
        let fileList = this.state.file.files
        for (let index = 0; index < file.length; index++) {
            if(!file[index].name) return
            fileList.push(file[index])            
        }
        this.setState({file:{ ...this.state.file, files:fileList }})
    }

    removeFile = file => {
        let fileList = this.state.file.files
        let update = fileList.filter(f => {
            return f != file
        })
        this.setState({file:{ ...this.state.file, files:update }})
    }

    componentDidMount(){
        this.getCategories()
    }

    render(){
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="card my-2">
                        <div className="card-header bg-info">
                            <h5 className="text-white">
                                <span className="fa fa-list mr-2"></span>
                                List of Categories
                            </h5>
                        </div>
                        <div className="card-body">
                            <button className="mb-2 btn btn-sm btn-success" onClick={() => this.addCategory()}>
                                <span className="fa fa-plus"></span> New Category
                            </button>
                            <br />
                            {this.infoCountCategory(this.state.categories.length)}
                            <div id="accordion">
                                {this.state.categories.map(category => (
                                    <CategoryList
                                    key={category.category_id}
                                    parent="accordion"
                                    id={category.category_id}
                                    categoryName={category.category_name}
                                    categoryStatus={category.status}
                                    questionList={category.questions}
                                    onCategoryEdit={() => this.editCategory(category)}
                                    onCategoryDrop={() => this.dropCategory(category)}
                                    onQuestionAdd={() => this.addQuestion(category)}
                                    onQuestionEdit={(question,cN) => this.editQuestion(question,cN)}
                                    onQuestionDrop={question => this.dropQuestion(question)}
                                    onFileAdd={question => this.addFile(question)}
                                    onFileDrop={file => this.dropFile(file)}
                                     />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* category modal */}
                <Modal id="category_modal" title="Category Form"
                colorHeader="white" bgHeader="primary" size="md">
                    <form onSubmit={ev => this.saveCategory(ev)}>
                        Category Name
                        <input type="text" className="form-control mb-1" required
                        value={this.state.category.category_name}
                        onChange={e => this.setState({category:{ ...this.state.category,category_name:e.target.value}})}
                        />

                        Status
                        <select className="form-control mb-1" required
                        value={this.state.category.status}
                        onChange={e => this.setState({category:{ ...this.state.category,status:e.target.value}})}>
                            <option value="1">Active</option>
                            <option value="0">Deactive</option>
                        </select>

                        <button type="submit" className="btn btn-block btn-sm btn-primary">
                            Save
                        </button>
                    </form>
                </Modal>

                {/* question modal */}
                <Modal id="question_modal" title="Question Form"
                colorHeader="white" bgHeader="primary" size="lg">
                    <form onSubmit={ev => this.saveQuestion(ev)}>
                        Category Name
                        <input type="text" className="form-control mb-1" readOnly
                        value={this.state.question.category_name}
                        />

                        Question Text
                        <CKEditor 
                        editor={ClassicEditor}
                        data={this.state.question.question}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.setState({question:{ ...this.state.question, question:data}})
                        } }
                        />

                        Answer Key
                        <input type="text" className="form-control mb-1" required
                        value={this.state.question.answer_key}
                        onChange={e => this.setState({question:{ ...this.state.question,answer_key:e.target.value}})}
                        />

                        Point
                        <input type="number" className="form-control mb-1" required
                        value={this.state.question.point}
                        onChange={e => this.setState({question:{ ...this.state.question,point:e.target.value}})}
                        />

                        Status
                        <select className="form-control mb-1" required
                        value={this.state.question.status}
                        onChange={e => this.setState({question:{ ...this.state.question,status:e.target.value}})}>
                            <option value="1">Active</option>
                            <option value="0">Deactive</option>
                        </select>

                        <button type="submit" className="btn btn-block btn-sm btn-primary">
                            Save
                        </button>
                    </form>
                </Modal>

                {/* file modal */}
                <Modal id="file_modal" title="Files Form"
                colorHeader="white" bgHeader="primary" size="lg">
                    <form onSubmit={ev => this.saveFiles(ev)}>
                        <small className="text-primary">Question</small> <br/ >
                        <div className="p-1"
                        dangerouslySetInnerHTML={{__html: this.state.file.question}}>
                        </div>
                        <small className="text-primary">Drag and Drop Your Files Here</small>
                        <DragDrop handleDrop={files => this.handleDrop(files)}>
                            <div style={{height:300, border:"2px solid"}}
                            className="col-sm-12">
                                <ul>
                                    {this.state.file.files.map((f,i) => (
                                        <li key={`FLS${i}`}>
                                            {f.name} 
                                            <small>
                                                <a href="#" onClick={() => this.removeFile(f)}
                                                className="text-danger mx-2">
                                                    [Delete]
                                                </a>
                                            </small>
                                            <br />
                                            <small className="text-primary">
                                            Size: { ((f.size/1024/1024) < 1) ? 
                                            Math.ceil(f.size/1024) + " KB" : 
                                            (f.size/1024/1024).toFixed(2) + " MB" }
                                            </small>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </DragDrop>
                        <button type="submit" className="mt-2 btn btn-block btn-sm btn-primary">
                            Save
                        </button>
                    </form>
                </Modal>
            </div>
        )
    }
}