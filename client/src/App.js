import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showAddTask: false,
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      totalTasks: 0,
      taskList: []
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleSubmit = this.submitFormHandler.bind(this);
  }
  

  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    //Load the total task count from the blockchain
    const taskCount = await contract.methods.showTaskCount().call();

    let arr = [];

    const response = await contract.getPastEvents(
      'TaskCreated',
      { fromBlock: 0 },
    );

    // console.log(response);
    // console.log(response[0].returnValues);

    // // Render out each task with a new task template
    // for (let i = 1; i <= taskCount; i++) {
    //   // Get the value from the contract to prove it worked.
    //   const task = await contract.methods.tasks(i).call();
    //   console.log(task);

    //   arr.push([{
    //     taskId: task[0],
    //     taskTitle: task[1],
    //     taskLocation: task[2],
    //     // taskTime: task[3],
    //     // taskNotificattion: task[4],
    //     // taskDateCreated: task[5],
        
    //   }])
    // }
   
   
    // Update state with the result.
    this.setState({ totalTasks: taskCount, taskList: response });
  };

  onChangeHandler = (e)=>{
    this.setState({[e.target.name]: e.target.value});

  }
  submitFormHandler = async (e)=>{
    e.preventDefault();
    const { accounts, contract, title, notification, time, location } = this.state;
    var date = new Date(time); // some mock date
    var milliseconds = date.getTime();
    console.log(title, location, milliseconds, parseInt(notification), accounts[0]);

    console.log(accounts[0]);
  
    const todos = await contract.methods.createTask(title, location, milliseconds, parseInt(notification)).send({
      from: accounts[0]
    })

    await console.log(todos);
    this.runExample()

  }


  render() {
    const { accounts, taskList, web3, showAddTask } = this.state;

    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {
          !showAddTask ? (
            <>

              <header className="header-container"></header>
              <div className="nav-line">
                <span className="uncompleted"></span>
                <span className="completed"></span>
              </div>

              <div className="layout-container">
                <h1>INBOX</h1>

                {
                  taskList.length !== 0 ? (
                    taskList.map((task, index) =>{

                      console.log(task.returnValues);
                      

                      const unixTimestamp = task.returnValues.dateCreated

                      const milliseconds = unixTimestamp * 1000 // 1575909015000

                      const dt = new Date(milliseconds);

                      var hours = dt.getHours() ; // gives the value in 24 hours format
                      var AmOrPm = hours >= 12 ? 'pm' : 'am';
                      hours = (hours % 12) || 12;
                      var minutes = dt.getMinutes() ;
                      var finalTime = hours + ":" + minutes + " " + AmOrPm;

                      
                      return (
                      
                      <div key={index} className="task-container">
        
                        <div className="d-flex task-list">
                          <div className="icon-container">
                            <ion-icon name="color-wand-outline"></ion-icon>
                          </div>
                          <div className="task">
                            <span className="title">{task.returnValues.title}</span>
                            <span className="location">{task.returnValues.location}</span>
                          </div>
                          <div>
                            <h2 className="time">{finalTime}</h2>
                          </div>
                        </div>
        
                        <hr className="hr" />
        
                      </div>
        
                      
                    )})

                  ) : null
                }
        
              
              </div>

              <div className="sticky-addbar" onClick={()=>this.setState({showAddTask: true})}>
                <ion-icon name="add-circle"></ion-icon>
              </div>

            </>
            
          ) : (
            <div className="layout-container bg-blue">

              <div className="d-flex align-center mb-2">

                <div className="icon-white" onClick={()=>this.setState({showAddTask: false})}><ion-icon name="arrow-back-circle-sharp"></ion-icon></div>
                <h3 className="text-white">Add new thing</h3>
                <div className="icon-white"><ion-icon name="options-sharp"></ion-icon></div>

              </div>

              <div className="pen-container">
                <ion-icon name="pencil-sharp"></ion-icon>
              </div>

              <form className="form" onSubmit={this.handleSubmit}>
                <p>
                  <input type="text" className="title" name="title" onChange={this.onChangeHandler} placeholder="Title" required/>
                </p>
                <p>
                  <input type="text" className="location" name="location" onChange={this.onChangeHandler} placeholder="Place" required />
                </p>
                <p>
                  <input type="datetime-local" className="timesub" name="time" onChange={this.onChangeHandler} placeholder="Time" required />
                </p>
                <p>
                  <input type="text" className="notification" name="notification" onChange={this.onChangeHandler} placeholder="Notification" required />
                </p>

                <button type="submit" className="submit-btn">ADD YOUR THING</button>
              </form>
            
            </div>
          )
        }

      </div>
    );
  }
}

export default App;
