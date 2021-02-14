import React from "react"

export default class ExamList extends React.Component{
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
        let examName = this.props.examName
        let examStatus = this.props.examStatus
        let examToken = this.props.examToken
        let examID = this.props.examID
        return (
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-lg-7 col-md-10 col-sm-12">
                            <small className="text-primary">Exam Name</small>
                            <h6>{examName}</h6>
                            {this.statusComponent(examStatus)}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12">
                            <small className="text-primary">Token Code</small>
                            <h6>
                                {examToken}
                                <button className="ml-2 btn btn-sm btn-info" onClick={this.props.onRefreshToken}>
                                    <span className="fa fa-sync"></span>
                                </button>
                            </h6>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <small className="text-info">Action</small> <br />
                            <button className="btn btn-sm btn-dark mx-1"
                            onClick={this.props.onSetCategory}>
                                <span className="fa fa-cog"></span> Set Category
                            </button>
                            <button className="btn btn-sm btn-info mx-1"
                            onClick={this.props.onExamEdit}>
                                <span className="fa fa-edit"></span>
                            </button>
                            <button className="btn btn-sm btn-danger mx-1"
                            onClick={this.props.onExamDrop}>
                                <span className="fa fa-trash"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}