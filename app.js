const inputTask = document.querySelector('#inputTask');
const addTaskBtn = document.querySelector('#addTaskButton');
const taskList = document.querySelector('#taskList');

/* ---------------- LOCAL STORAGE ---------------- */

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').innerText,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTask(task.text, task.completed));
}

/* ---------------- CREATE TASK ---------------- */

function createTask(taskText, completed = false) {

    const listItem = document.createElement('li');

    listItem.innerHTML = `
        <div class="task-left">
            <i class="tick"></i>
            <span class="task-text">${taskText}</span>
        </div>

        <div class="task-icons">
            <i class="fa-solid fa-pen-to-square edit"></i>
            <i class="fa-solid fa-trash delete"></i>
        </div>
    `;

    if (completed) listItem.classList.add('completed');

    taskList.appendChild(listItem);

    const taskLeft = listItem.querySelector('.task-left');
    const taskSpan = listItem.querySelector('.task-text');
    const statusIcon = listItem.querySelector('.tick');
    const deleteIcon = listItem.querySelector('.delete');
    const editIcon = listItem.querySelector('.edit');

    /* ---------------- TOGGLE COMPLETE ---------------- */
    const toggleComplete = () => {
        listItem.classList.toggle('completed');
        saveTasks();
    };

    statusIcon.addEventListener('click', toggleComplete);
    taskSpan.addEventListener('click', toggleComplete);

    /* ---------------- DELETE ---------------- */
    deleteIcon.addEventListener('click', () => {
        listItem.remove();
        saveTasks();
    });

    /* ---------------- EDIT → SAVE ---------------- */
    editIcon.addEventListener('click', () => {

        if (editIcon.classList.contains('fa-floppy-disk')) {
            const input = taskLeft.querySelector('input');
            const updatedText = input.value.trim();

            if (updatedText !== '') taskSpan.innerText = updatedText;

            taskLeft.replaceChild(taskSpan, input);
            editIcon.classList.remove('fa-floppy-disk');
            editIcon.classList.add('fa-pen-to-square');
            saveTasks();
            return;
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.value = taskSpan.innerText;

        taskLeft.replaceChild(input, taskSpan);
        editIcon.classList.remove('fa-pen-to-square');
        editIcon.classList.add('fa-floppy-disk');
        input.focus();
    });

    saveTasks();
}

/* ---------------- ADD TASK ---------------- */

addTaskBtn.addEventListener('click', () => {
    const taskText = inputTask.value.trim();

    if (taskText !== '') {
        createTask(taskText);
        inputTask.value = '';
    } else {
        alert('Please enter a task');
    }
});

/* ---------------- LOAD TASKS ---------------- */

loadTasks();
