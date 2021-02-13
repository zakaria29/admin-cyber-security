import React from "react"
export default class SchoolList extends React.Component{
    infoCountTeam = count => {
        if (count === 0) {
            return (
                <i className="text-warning">List of team is empty</i>
            )
        }else{
            return null
        }
    }

    infoCountMember = count => {
        if (count === 0) {
            return (
                <i className="text-warning">List of member is empty</i>
            )
        }else{
            return null
        }
    }

    render(){
        let parent = this.props.parent
        let headerID = `heading${this.props.id}`
        let childID = `collapse${this.props.id}`
        let schoolName = this.props.schoolName
        let schoolAddress = this.props.schoolAddress
        let teamList= this.props.teamList
        return (
            <div className="card">
                <div className="card-header" id={headerID}>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <small className="text-info">School Name</small>
                            <h6>{schoolName}</h6>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <small className="text-info">School Address</small>
                            <h6>{schoolAddress}</h6>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6">
                            <small className="text-info">View Team</small> <br />
                            <button className="btn btn-sm btn-block btn-success"
                            data-toggle="collapse" data-target={`#${childID}`}
                            aria-expanded="true" aria-controls={childID}>
                                <span className="fa fa-users"></span> Team
                            </button>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6">
                            <small className="text-info">Action</small> <br />
                            <button className="btn btn-sm btn-info mx-1"
                            onClick={this.props.onSchoolEdit}>
                                <span className="fa fa-edit"></span>
                            </button>
                            <button className="btn btn-sm btn-danger mx-1"
                            onClick={this.props.onSchoolDrop}>
                                <span className="fa fa-trash"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div id={childID} className="collapse" aria-labelledby={headerID} data-parent={`#${parent}`}>
                    <div className="card-body">
                        <h5 className="text-primary">
                            List of Teams
                            <button className="mx-3 btn btn-sm btn-success"
                            onClick={this.props.onTeamAdd}>
                                <span className="fa fa-plus"></span> New Team
                            </button>
                        </h5>
                        <hr />
                        {this.infoCountTeam(teamList.length)}
                        {teamList.map(team => (
                            <div className="mb-2" key={team.team_id}>
                                <strong>
                                    {team.team_name}
                                    <button className="ml-2 mr-1 btn btn-sm btn-info"
                                    onClick={() => this.props.onTeamEdit(team,schoolName)}>
                                        <span className="fa fa-edit"></span>
                                    </button>
                                    <button className="mx-1 btn btn-sm btn-danger"
                                    onClick={() => this.props.onTeamDrop(team)}>
                                        <span className="fa fa-trash"></span>
                                    </button>
                                    <button className="mx-1 btn btn-sm btn-primary"
                                    onClick={() => this.props.onMemberAdd(team)}>
                                        <span className="fa fa-plus"></span> New Member
                                    </button>
                                </strong>
                                <hr />
                                {this.infoCountMember(team.members.length)}
                                <ul className="list-group">
                                    {team.members.map(member => (
                                        <li className="list-group-item my-1" key={member.member_id}>
                                            <div className="row">
                                                <div className="col-lg-5 col-sm-12">
                                                    <small className="text-info">Name and Email</small><br />
                                                    <strong>{member.member_name}</strong><br />
                                                    <small className="text-success">
                                                        {member.email}
                                                    </small>
                                                </div>
                                                <div className="col-lg-4 col-sm-12">
                                                    <small className="text-info">Username</small>
                                                    <h6>{member.username}</h6>
                                                </div>
                                                <div className="col-lg-3 col-sm-12">
                                                    <small className="text-info">Action</small> <br />
                                                    <button className="mx-1 btn btn-sm btn-info"
                                                    onClick={() => this.props.onMemberEdit(member,team.team_name)}>
                                                        <span className="fa fa-edit"></span>
                                                    </button>
                                                    <button className="mx-1 btn btn-sm btn-danger"
                                                    onClick={() => this.props.onMemberDrop(member)}>
                                                        <span className="fa fa-trash"></span>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        )
    }
}