angular.module("TaskController", ["userService"]).controller("TaskCntrl", function(User, $scope) {
    var app = this;
  
    app.closeModal = function() {
      $('#modal-lg2').modal('hide');
      app.toasterFunction();
    };
    app.closeEditModal = function() {
      $('#modal-lg3').modal('hide');
      app.toasterFunction();
    };
  
    //create task script
   this.createTask = function(passedUserID){
    var checkUserId = passedUserID;
    var taskDetail =  app.TaskFormData.taskDetail ;
    if(!taskDetail){
        console.log("error has occured , please ensure there are details to be send to be saved as tasks")
    }else{
        User.createTask({_id : checkUserId , user_task : taskDetail}).then(function(data){
          if(data){
            console.log("a new task has been created and stored in the system");
          }else{
            console.log("error in backend for adding tasks to the system")
          }
        })
       
    }
    app.TaskFormData.taskDetail = '';
    app.closeModal() ;
    reloadTaskList();
   };

   //read or get task list script
   var reloadTaskList = function(){
    User.readTask().then(function(TaskdataRetrievedFromBackend){
      var userTaskData = TaskdataRetrievedFromBackend.data.data.tasks;
      var showTaskListArray = [];
      _.forEach(userTaskData, function(item) {
        showTaskListArray.push({
          activityId: item._id,
          showActivityData: item.user_task,
          showActivityDate: item.task_created_date,
          showActivityTime: item.task_created_time
        });
      });
      var listItem = Object.keys(showTaskListArray).length;
      //show no data section if tasks are empty
      if( listItem === 0){
        app.listEmpty = true;
      }else{
        app.listEmpty = false;
      }
      app.toDoList = showTaskListArray;
    })
   };
   reloadTaskList();

   //edit for view specific task in modal
   app.editTaskFunction = function(passedId){
    var IdToFetchSpecificTask = passedId;
    User.editTask(IdToFetchSpecificTask).then(function(TaskdataRetrievedFromBackend){
      //assign the value fetched to the edit modal for updating the task
      $scope.taskTobeEdited = TaskdataRetrievedFromBackend.data.userTaskfroEdit;
      //used next for updating script
      $scope.taskIdforUpdate = TaskdataRetrievedFromBackend.data._id;
    })
   };

   //update task script
   app.updateTask = function(passedId){
    var idOfupdatedTask = passedId;
    var updatedTask = $scope.taskTobeEdited;
    var updateDataObject = {
        _id : idOfupdatedTask,
        user_task : updatedTask
    }
    User.updateTask(updateDataObject).then(function(data){
      if(data.data.success){
        console.log("successfully updated the task");
        reloadTaskList();
      }else{
        console.log("error occured in updating the task in the system");
      }
    })
    app.closeEditModal();
   }

//delete task script
this.deleteTaskFunction = function(passedId) {
  showModal(1);
  app.confirmDelete = function() {
    User.deleteTask(passedId).then(function(data) {
      if (data.data.success) {
        reloadTaskList();
        console.log("successfully deleted the task");
      } else {
        console.log("error in deleting task from the system, error:", data.data.message);
      };
    });
    showModal(2);
    this.toasterFunction();
  };
  app.cancelDelete = function() {
    showModal(2);
  };
};


//styling modals and toaster scripts
   var showModal = function(options) {
    app.modalHeader = undefined;
    app.modalContent = undefined;
    if (options === 1) {
      app.modalHeader = 'Are you sure?';
      app.modalContent = 'Do you want to proceed in deleting this task from the system?';
      $('#modal-danger').modal({ backdrop: "static" });
    } else if (options === 2) {
      $('#modal-danger').modal('hide');
    }
  };
  
    this.toasterFunction = function() {
      var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
  
      $(document).on('click', '.swalDefaultSuccess', function() {
        Toast.fire({
          icon: 'success',
          title: 'Task Details has been saved to the system'
        });
      });
  
      $(document).on('click', '.swalDefaultError', function() {
        Toast.fire({
          icon: 'error',
          title: 'Task Details have not been saved to the system'
        });
      });
  
      $(document).on('click', '.swalDefaultInfo', function() {
        Toast.fire({
          icon: 'info',
          title: 'The task has been successfully deleted from the system'
        });
      });
    };
  });
  