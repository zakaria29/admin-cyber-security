import React from "react"

export default class Toast extends React.Component{
    render(){
        let bg = this.props.bgColor
        let text = this.props.textColor
        let cn = `toast align-items-center text-${text} bg-${bg} border-0`
        return (
            <div className="position-fixed bottom-0 end-0" style={{zIndex:5}}>
                <div className={cn} id={this.props.id}
                role="alert" aria-live="polite" aria-atomic="true"
                data-bs-delay="10000">
                    <div className="d-flex">
                        <div className="toast-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
            
        
        );
    }
}