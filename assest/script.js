const textInput = document.getElementById("input");
const newTasks = document.getElementById("new-tasks");
const completedTasks = document.getElementById("completed-tasks")
let allTasks;

allTasks = JSON.parse(localStorage.getItem("allTasks"))??[];
allTasks.forEach(task => renderTask(task));

window.addEventListener("storage", function () {
    newTasks.innerHTML = "";
    allTasks = JSON.parse(localStorage.getItem("allTasks"))??[];
    allTasks.forEach(task => renderTask(task));
} );

// Function declarations


function Task(value) {
    this.id = Date.now();
    this.value = value.trim();
    this.timeout = null;
    this.complatedAt = null;
}

function createTask(value){
    return new Task(value);
}

function findTask(array, id){
    return array.find(task => task.id === id);
}

function removeTask(array, id){
    return array.filter(task => task.id !== id);  
}

function updateStorage(){
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function complateTask(e) {
    const currentTask = findTask(allTasks, +e.target.dataset.id);
    if(e.target.checked) {
        currentTask.timeout = setTimeout( () => {
            const currentLi = e.target.parentElement;
            completedTasks.appendChild(currentLi);
            e.target.remove();
            allTasks = removeTask(allTasks, currentTask.id);
            updateStorage();
            setTimeout( () => {
                currentLi.remove();
            }, 5000)
        }, 2000
        )
    } else {
        if(currentTask.timeout){
            clearTimeout(currentTask.timeout);
            currentTask.timeout = null;
        }
    }
    
}

function renderTask(task) {
    const li = document.createElement("li");
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    const span = document.createElement("span");
    span.textContent = task.value;

    newTasks.appendChild(li);
    li.appendChild(checkBox);
    checkBox.dataset.id = task.id;
    li.appendChild(span);

    checkBox.addEventListener("change", complateTask)
}


// Listeners

textInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && textInput.value.trim() !== "") {
        const task = createTask(textInput.value);
        allTasks.push(task);
        updateStorage();
        textInput.value = "";
        renderTask(task);
    }
});






textInput.focus();