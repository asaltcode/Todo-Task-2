import React, { useState } from 'react';
import DeleteBtn from './DeleteBtn';
import TodoLoader from '../animation/TodoLoader';
import { format } from 'timeago.js';

const DefaultData = [
    {
      id: 1,
      name: 'This task shows the default',
      status: true,
      assignedBy: 'Bob',
      category: 'bg-warning',
      createdAt: Date.now()
    },
  ];

const TodoList = () => {
  // localStorage.setItem("tasks", JSON.stringify(tasks))
  const data = localStorage.getItem('tasks');
  const [tasks, setTasks] = useState(data === null ? [...DefaultData] : [...JSON.parse(data)])
  const [input, setInput] = useState("")
  const handleAddTask = () =>{    
    const newTask = {
      id: tasks.length + 1,
      name: input,
      status: false,
      assignedBy: 'You', // You can customize this
      category: 'bg-primary', // You can customize this
      createdAt: Date.now()
    };

    setTasks([newTask, ...tasks]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]))
     setInput('')
  }

  const handleComplete = (task, index) => {
    const access = confirm("Have you really completed this task?")
    if(access){
      const newArray = [...tasks]
      const update = {...task, status : true}
      newArray.splice(index, 1, update)
      setTasks(newArray)
      localStorage.setItem("tasks", JSON.stringify(newArray))
    }
  }

    
  return (
    <div className="row d-flex justify-content-center m-0 p-0 align-items-center vh-100">
      <div className="col-md-8 col-sm-12">
        <div className="card-hover-shadow-2x mb-3 card">
          <div className="card-header-tab card-header">
            <div className="card-header-title font-size-lg text-capitalize text-white font-weight-normal">
              <i className="fa fa-tasks"></i>&nbsp;Task Lists
            </div>
          </div>
          <div className="scroll-area-sm">
            <perfect-scrollbar className="ps-show-limits">
              <div style={{ position: 'static' }} className="ps ps--active-y">
                <div className="ps-content">
                  {tasks.length === 0 ?<TodoLoader/> :
                  <ul className="list-group list-group-flush">
                  {
                    tasks && tasks.map((task, index) =>{
                      return (
                        <li key={index} className="list-group-item">
                          <div className={`todo-indicator ${task.category}`}></div>
                          <div className="widget-content p-0">
                            <div className="widget-content-wrapper">                                
                              <div className="widget-content-left">
                                <div className="widget-heading">{task.name}
                                  {!task.status || "" ? <div className="badge badge-danger ml-2">No completion</div>
                                   : <div className="badge badge-success ml-2">Completed</div> }
                                </div>
                                <div className="widget-subheading"><i>{format(task?.createdAt)}</i></div>
                              </div>
                              <div className="widget-content-right d-flex ">
                                <button className={`completeBtn ${task.status && "invisible"}`} onClick={()=> handleComplete(task, index)} type="button"><i className="fa fa-solid fa-check"></i></button>                           
                                <DeleteBtn tasks={tasks} setTasks={setTasks} task={task} index={index} />                             
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })
                  }                    
                </ul>
                  }
                  
                </div>
              </div>
            </perfect-scrollbar>
          </div>
          <div className="row card-footer justify-content-center">
            <div className="col-12 col-sm-9 col-md-7">
            <div className="form mt-2">
              <input className="input" placeholder="Type your task" value={input} onChange={(data) => setInput(data.target.value)} required="" type="text"/>
              <span className="input-border"></span>
            </div>
            </div>
            <div className="col-12 col-sm-3 col-md-4 mt-2">
               <button disabled={input.trim() === ''}  onClick={handleAddTask} className="button m-auto"> Add Task</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
