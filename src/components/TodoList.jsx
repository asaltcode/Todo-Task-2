import React, { useEffect, useRef, useState } from 'react';
import DeleteBtn from './DeleteBtn';
import TodoLoader from '../animation/TodoLoader';

const DefaultData = [
    {
      id: 1,
      name: 'This task shows the default',
      status: 'Rejected',
      assignedBy: 'Bob',
      category: 'bg-warning'
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
      status: 'NEW',
      assignedBy: 'You', // You can customize this
      category: 'bg-primary', // You can customize this
    };

    setTasks([...tasks, newTask]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]))
     setInput('')
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
                                <div className="widget-heading">{task.name}<div className="badge badge-danger ml-2">Rejected</div>
                                </div>
                                <div className="widget-subheading"><i>By Bob</i></div>
                              </div>
                              <div className="widget-content-right d-flex ">
                                <DeleteBtn tasks={tasks} setTasks={setTasks} task={task} index={index}  />                             
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
