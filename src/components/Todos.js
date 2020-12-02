import React, { useState, useContext, useEffect } from "react";
import { CredentialsContext } from "../App";
import { v4 as uuidv4 } from "uuid";
import './Todo.css';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(2),
  },
  form:{
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button:{
    width:'10ch',
    height:'6ch',
  }
}));

export default function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [credentials] = useContext(CredentialsContext);
  const [filter, setFilter] = useState("uncompleted");

  // make request to backend, send the old state todos
  const persist = (newTodos) => {
    fetch(`http://localhost:5000/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials.username}:${credentials.password}`,
      },
      body: JSON.stringify(newTodos),
    }).then(() => {});
  };

  // whenever todo changes, call 
  useEffect(() => {
    fetch(`http://localhost:5000/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials.username}:${credentials.password}`,
      },
    })
      .then((response) => response.json())
      .then((todos) => setTodos(todos));
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!todoText) return;
    const newTodo = { id: uuidv4(), checked: false, text: todoText };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setTodoText("");
    // save data to backend
    persist(newTodos);
  };

  const toggleTodo = (id) => {
    const newTodoList = [...todos];
    const todoItem = newTodoList.find((todo) => todo.id === id);
    todoItem.checked = !todoItem.checked;
    setTodos(newTodoList);
    persist(newTodoList);
  };

  const getTodos = () => {
    return todos.filter((todo) =>
      filter === "completed" ? todo.checked : !todo.checked
    );
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };


  function Todo() {
    return(
        <div className="todo-item">
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Filter</InputLabel>
              <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Filter"
              value={filter}
              onChange={(e) => changeFilter(e.target.value)}>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="uncompleted">Uncompleted</MenuItem>
            </Select>
          </FormControl>

        {getTodos().map((todo,index) => (
          <div key={todo.id}>
              <FormLabel className={classes.formControl}
                        component="todo">{index + 1}</FormLabel>
              <FormControlLabel
                control={<Checkbox checked={todo.checked}
                onChange={() => toggleTodo(todo.id)} />}
                label={todo.text}
              />
          </div>   
      ))}
      {/* <form onSubmit={addTodo}
              className={classes.form}
              noValidate autoComplete="off">
          <TextField id="outlined-basic"
                     label="Add to do"
                     variant="outlined" 
                     value={todoText}
                     onChange={(e) => setTodoText(e.target.value)}
                     type="text"
                     />
        <Button variant="contained" color="secondary">Add</Button>
      </form> */}
      <form onSubmit={addTodo}>
        <input
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Add</button>
      </form>
    </div>   
    )
  }

  return (
    <div>
      <Todo/>
    </div>
  );
}

