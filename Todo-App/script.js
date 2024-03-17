const taskInput = document.querySelector(".input-bar input");
const filters = document.querySelectorAll('.filters span');
const clear = document.querySelector('.clear-btn');
const taskBox = document.querySelector('.task-box');

let editId;
let isEditedTask = false;

// get localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list")); // parse this localStorage data to js object 

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let list = "";
    if(todos) { //if task is not empty
        todos.forEach((todo, id) => {
            //if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                list += `<li class="task">
                        <label for="${id}">
                            <input onClick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p> 
                        </label>
                        <div class="settings">
                            <i onClick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                            <ul class="task-menu">
                                <li onClick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                                <li onClick="deleteTask(${id}, '${filter}')"><i class="fa-regular fa-trash-can"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
            }  
        });
    }
    taskBox.innerHTML = list || `<span> You don't have any task here </span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clear.classList.remove("active") : clear.classList.add("active");
}
showTodo("all");

function showMenu(selectedTask) {
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");

    document.addEventListener("click", (e) => {
        //removing show class from the task menu on the document click
        if(e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    })
}

function deleteTask(id, filter) {
    isEditedTask = false;
    //removing selected task from todos
    todos.splice(id, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter)
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true
    taskInput.value = taskName;
    taskInput.classList.add("active");
}

function updateStatus(selectedTask) {
    //getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        //updating the status of selected task to completed
        todos[selectedTask.id].status = "completed";
    }
    else {
        taskName.classList.remove("checked");
        //updating the status of selected task to pending
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

clear.addEventListener("click", () => {
    //removing all task from todos
    isEditedTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
})

// keyup = a key is released
taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim(); //.trim() used to prevent entering empty value
    if(e.key == "Enter" && userTask){
        
        if(!isEditedTask){ //false
            if(!todos) { //if todo doesn't exist, pass an empty array
                todos = [];
            }
            let taskInfo = {name : userTask, status:"pending"} //by default status is pending
            todos.push(taskInfo); //adding new task to todos
        }
        else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        
        taskInput.value = ""; //clearing the test field
        localStorage.setItem("todo-list", JSON.stringify(todos)) //we have to convert data into string to store it on localStorage
        showTodo(document.querySelector("span.active").id);
    }
});