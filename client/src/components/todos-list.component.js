//Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//The Todo component that will contain all the todo elements, used in line #44
const Todo = props => (
    <tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
        </td>
    </tr>
)

export default class TodosList extends Component {

    //Start with Empty todo array
    constructor(props) {
        //super() is used to call the parent constructor. 
        //super(props) would pass props to the parent constructor. 
        //From your example, super(props) would call the React.Component constructor passing in props as the argument
        super(props);
        this.state = {todos: []};
    }

    //Get the todos after the component mounts
    componentDidMount() {
        axios.get('http://localhost:4000/todos/')
            .then(response => {
                //Set the state of the empty todos array to include all the todos
                this.setState({ todos: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }

    //Function to map over the todos
    todoList() {
        return this.state.todos.map(function(currentTodo, i){
            return <Todo todo={currentTodo} key={i} />;
        })
    }
    
    
    render() {
        return (
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Call todiList to map over the todos */}
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
}