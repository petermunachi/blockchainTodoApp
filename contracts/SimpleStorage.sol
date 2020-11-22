// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  uint public taskCount = 0;

  

  event TaskCreated(uint indexed id, string title, string location, uint time, uint notification, uint dateCreated, bool completed );
  event TaskCompleted(uint indexed id);

  constructor () public {
  }

  function createTask(string calldata _title, string calldata _location, uint _time, uint _notification) external {
    emit TaskCreated(taskCount++, _title, _location, _time, _notification, now, false);
    taskCount++;
  }

  function showTaskCount() public view returns(uint) {
    return taskCount;
  }

  function toggleCompleted(uint _id) external  {
    emit TaskCompleted(_id);
  }


}


// pragma solidity >=0.5.0 <0.8.0;

// contract SimpleStorage {
//   uint public taskCount = 0;

//   struct Task {
//     uint id;
//     string content;
//     bool completed;
//   }

//   mapping (uint=>Task) public tasks;

//   event TaskCreated(uint id, string content, bool completed );
//   event TaskCompleted(uint id, bool completed);

//   constructor () public {

//     createTask("My First Successful Dapp");
    
//   }

//   function createTask(string memory _content) public {
//     taskCount++;
//     tasks[taskCount] = Task(taskCount, _content, false);
//     emit TaskCreated(taskCount, _content, false);
//   }

//   function showTaskCount() public view returns(uint) {
//     return taskCount;
//   }

//   function toggleCompleted(uint _id) public  {
//     Task memory _task = tasks[_id];
//     _task.completed = !_task.completed;
//     tasks[_id] = _task;
//     emit TaskCompleted(_id, _task.completed);
//   }
  

// }
