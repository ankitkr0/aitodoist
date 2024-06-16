document.getElementById('task-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const task = document.getElementById('task').value;
    if (task.trim() !== '') {
        await breakDownTask(task);
    }
});

async function breakDownTask(task) {
    try {
        const response = await fetch('/breakdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        });

        const data = await response.json();
        const subtasks = data.tasks.split('\n').slice(1); // Remove main task
        saveTasksLocally(task, subtasks);
        displaySubTasks(subtasks);
        updateProgress();
        checkAchievements();
    } catch (error) {
        console.error('Error:', error);
    }
}

function displaySubTasks(subtasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    subtasks.forEach(subtask => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'mr-2';
        checkbox.addEventListener('change', updateProgress);

        const label = document.createElement('label');
        label.textContent = subtask;
        label.className = 'text-gray-700';

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-task';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            updateProgress();
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(label);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('#task-list input[type="checkbox"]');
    const completed = document.querySelectorAll('#task-list input[type="checkbox"]:checked').length;
    const progress = (completed / checkboxes.length) * 100;

    const progressBarFill = document.getElementById('progress-bar-fill');
    progressBarFill.style.width = `${progress}%`;

    updateBackground(progress);
}

function checkAchievements() {
    const badgesContainer = document.getElementById('badges');
    badgesContainer.innerHTML = '';

    const checkboxes = document.querySelectorAll('#task-list input[type="checkbox"]');
    const completed = document.querySelectorAll('#task-list input[type="checkbox"]:checked').length;

    if (completed === checkboxes.length) {
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.textContent = 'All Tasks Completed!';
        badgesContainer.appendChild(badge);
    }

    // Add more achievements as needed
}

function updateBackground(progress) {
    const body = document.body;
    if (progress === 100) {
        body.style.backgroundColor = "#d4edda";
    } else if (progress >= 50) {
        body.style.backgroundColor = "#fff3cd";
    } else {
        body.style.backgroundColor = "#f8d7da";
    }
}

function saveTasksLocally(mainTask, subtasks) {
    const previousTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    previousTasks.push({ mainTask, subtasks });
    localStorage.setItem('tasks', JSON.stringify(previousTasks));
}

function togglePreviousTasks() {
    const popup = document.getElementById('previous-tasks-popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        displayPreviousTasks();
        popup.style.display = 'flex';
    } else {
        popup.style.display = 'none';
    }
}

function displayPreviousTasks() {
    const previousTasksList = document.getElementById('previous-tasks-list');
    previousTasksList.innerHTML = '';
    const previousTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    previousTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.textContent = task.mainTask;
        previousTasksList.appendChild(taskItem);
    });
}

function refreshPage() {
    window.location.reload();
}

// Load previous tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    const previousTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (previousTasks.length > 0) {
        const lastTask = previousTasks[previousTasks.length - 1];
        displaySubTasks(lastTask.subtasks);
        updateProgress();
    }
});