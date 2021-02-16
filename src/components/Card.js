import React from "react"

export default class Card extends React.Component{
    render(){
        return (
            <div className={this.props.className}>
                <div className={`card border border-${this.props.iconColor} rounded`}>
                    <div className="card-content">
                        <div className="card-body bg-light">
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <i className={`${this.props.icon} fa-3x text-${this.props.iconColor} float-left`}>
                                    </i>
                                </div>
                                <div className="media-body text-right">
                                    <h2 className={`text-${this.props.iconColor}`}>{this.props.count}</h2>
                                    <h5>{this.props.label}</h5>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}