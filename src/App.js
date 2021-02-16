import React from "react"
import { Route, Switch } from "react-router-dom";

import Login from "./pages/Login"
import Home from "./pages/Home"
import School from "./pages/School"
import Category from "./pages/Category"
import Exam from "./pages/Exam"
import Admin from "./pages/Admin"
import Judge from "./pages/Judge"

export default class App extends React.Component{
    render(){
        return (
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/school" component={School} />
                <Route path="/category" component={Category} />
                <Route path="/exam" component={Exam} />
                <Route path="/admin" component={Admin} />
                <Route path="/judge" component={Judge} />
            </Switch>
        );
    }
}