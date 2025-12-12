let tasksData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#completed');

const tasks = document.querySelectorAll('.task');

let draggedTask = null; // to store the task being dragged

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

        // update task count
        [todo, progress, done].forEach(col => {
            const tasks = col.querySelectorAll('.task');
            const count = col.querySelector('.bright');

            count.innerText = tasks.length;
        });
    
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
    const div = document.createElement('div');

    div.classList.add('task');
    div.setAttribute('draggable', 'true');

    div.innerHTML = `<h2>${taskTitle}</h2>
                    <p>${taskDesc}</p>
                    <button>Delete</button>
    `;

    todo.appendChild(div);

    // update task count
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.bright');

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title : t.querySelector('h2').innerText,
                descp : t.querySelector('p').innerText
            }
        });

        count.innerText = tasks.length;
    });

    // add drag event to the new task
    div.addEventListener('drag', (e) => {
        draggedTask = div;
    });

    modal.classList.remove('active');
});


// local storage functionality to save tasks