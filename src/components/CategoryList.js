import React from "react"
import { storage_url } from "../config";

export default class CategoryList extends React.Component{
    infoCountQuestion = count => {
        if (count === 0) {
            return (
                <i className="text-warning">List of questions is empty.</i>
            )
        }else{
            return null
        }
    }

    infoCountFile = count => {
        if (count === 0) {
            return (
                <i className="text-warning">There is no attached files.</i>
            )
        }else{
            return null
        }
    }

    statusComponent = (status) => {
        if (status) {
            return (
                <h6>
                    <span className="badge badge-success">Active</span>
                </h6>
            )
        } else {
            return (
                <h6>
                    <span className="badge badge-danger">Inactive</span>
                </h6>
            )
        }
    }

    render(){
        let parent = this.props.parent
        let headerID = `heading${this.props.id}`
        let childID = `collapse${this.props.id}`
        let categoryName = this.props.categoryName
        let categoryStatus = this.props.categoryStatus
        let questionList= this.props.questionList

        return(
            <div className="card">
                <div className="card-header" id={headerID}>
                    <div className="row">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <small className="text-info">Category Name</small> <br />
                            <strong>{categoryName}</strong>
                            {this.statusComponent(categoryStatus)}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12">
                            <small className="text-info">View Questions</small> <br />
                            <button className="btn btn-sm btn-block btn-success"
                            data-toggle="collapse" data-target={`#${childID}`}
                            aria-expanded="true" aria-controls={childID}>
                                <span className="fas fa-folder-open"></span> Questions
                            </button>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12">
                            <small className="text-info">Action</small> <br />
                            <button className="btn btn-sm btn-info mx-1"
                            onClick={this.props.onCategoryEdit}>
                                <span className="fa fa-edit"></span>
                            </button>
                            <button className="btn btn-sm btn-danger mx-1"
                            onClick={this.props.onCategoryDrop}>
                                <span className="fa fa-trash"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div id={childID} className="collapse" aria-labelledby={headerID} data-parent={`#${parent}`}>
                    <div className="card-body">
                        <h5 className="text-primary">
                            List of Questions
                            <button className="mx-3 btn btn-sm btn-success"
                            onClick={this.props.onQuestionAdd}>
                                <span className="fa fa-plus"></span> New Question
                            </button>
                        </h5>
                        <hr />
                        {this.infoCountQuestion(questionList.length)}
                        <ul className="list-group">
                            {questionList.map(question => (
                                <li className="list-group-item mb-2" key={question.question_id}
                                style={{borderBottom:"3px solid navy"}}>
                                    <div className="row">
                                        <div className="col-lg-8 col-sm-md-12 col-sm-12">
                                            <small className="text-primary">Question and Answer</small> <br />
                                            <div dangerouslySetInnerHTML={{__html: question.question}}>
                                            </div> <br />
                                            <strong className="text-success">
                                                Answer: {question.answer_key}
                                            </strong>
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                            <small className="text-primary">Point</small>
                                            <h4>{question.point}</h4>
                                            {this.statusComponent(question.status)}
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-sm-6">
                                            <small className="text-primary">Action</small> <br />
                                            <button className="mx-1 btn btn-sm btn-info"
                                            onClick={() => this.props.onQuestionEdit(question, categoryName)}>
                                                <span className="fa fa-edit"></span>
                                            </button>
                                            <button className="mx-1 btn btn-sm btn-danger"
                                            onClick={() => this.props.onQuestionDrop(question)}>
                                                <span className="fa fa-trash"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <strong>Attached Files</strong>
                                    <button className="mx-3 btn btn-sm btn-success"
                                    onClick={() => this.props.onFileAdd(question)}>
                                        <span className="fa fa-plus"></span> Attach File
                                    </button>
                                    <hr />
                                    {this.infoCountFile(question.files.length)}
                                    <div className="row">
                                        {question.files.map(file => (
                                            <div className="col-lg-4 col-md-6 col-sm-12" key={file.file_id}>
                                                <a href={storage_url+file.file_name} download
                                                target="_blank">
                                                    {file.file_name}
                                                </a>
                                                <a className="text-danger mx-1" href="#"
                                                onClick={() => this.props.onFileDrop(file)}>
                                                    <small>Delete</small>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}