let tasksData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#completed');

const tasks = document.querySelectorAll('.task');

let draggedTask = null; // to store the task being dragged

// utility function to create a new task div
function createDiv(title, descp, column) {
    const div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true');
    div.innerHTML = `<h2>${title}</h2>
                    <p>${descp}</p>
                    <button>Delete</button>`;
    column.appendChild(div);

    div.addEventListener('drag', (e) => {
        draggedTask = div;
    });

    // delete button functionality
    const deleteBtn = div.querySelector('button');
    deleteBtn.addEventListener('click', () => {
        div.remove();
        updateTaskCount();
    });

    return div;
}


// taskcount update function
function updateTaskCount() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.bright');

        // update tasksData in each column for local storage
        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title : t.querySelector('h2').innerText,
                descp : t.querySelector('p').innerText
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasksData)); // save to local storage

        count.innerText = tasks.length;
    });
}


// load tasks from local storage if available
if (localStorage.getItem('tasks')) {
    const data = JSON.parse(localStorage.getItem('tasks'));

    // console.log(data);

    for (const col in data) {
        const column = document.querySelector(`#${col}`);

        data[col].forEach(taskData => {
            createDiv(taskData.title, taskData.descp, column);
        });

        updateTaskCount();
    }
}

// drag event for tasks
tasks.forEach(task => {
    task.addEventListener('drag', (e) => {
        // console.log("dragging", e);
        draggedTask = task;
    });
});


// drag and drop events for columns and tasks 
function addDragEvents(column) {

    column.addEventListener('dragenter', (e) => {
        e.preventDefault();
        column.classList.add('hoverOver');
    });
    column.addEventListener('dragleave', (e) => {
        e.preventDefault();
        column.classList.remove('hoverOver');
    });

    column.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessary to allow dropping in browsers
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();

        console.log("dropped", draggedTask, column);

        column.appendChild(draggedTask);
        column.classList.remove('hoverOver');

        // update task count when task is dropped
        updateTaskCount();
    
    });
}

addDragEvents(todo);
addDragEvents(progress);
addDragEvents(done);


// add new task modal functionality
const modal = document.querySelector('.modal');
const toggleModalBtn = document.querySelector('#toggleModal');
const addTaskBtn = document.querySelector('#addTaskBtn');
const cross = document.querySelector('.back');

toggleModalBtn.addEventListener('click', () => {
    modal.classList.toggle('active');
});

cross.addEventListener('click', () => {
    modal.classList.remove('active');
});

addTaskBtn.addEventListener('click', () => {

    const taskTitle = document.querySelector('#taskTitle').value;
    const taskDesc = document.querySelector('#descp').value;

    // create new task element
    const div = createDiv(taskTitle, taskDesc, todo); 
    todo.appendChild(div);

    // update task count when new task is added
    updateTaskCount();

    modal.classList.remove('active');
});