document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const priorityFilter = document.getElementById('priorityFilter');
    const dueDateFilter = document.getElementById('dueDateFilter');

    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const response = await fetch('/tasks', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            window.location.reload();
        }
    });

    taskList.addEventListener('click', async function(e) {
        if (e.target.classList.contains('toggleComplete')) {
            const taskId = e.target.closest('tr').dataset.id;
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: e.target.textContent === 'Mark Complete' })
            });
            if (response.ok) {
                e.target.textContent = e.target.textContent === 'Mark Complete' ? 'Mark Incomplete' : 'Mark Complete';
            }
        } else if (e.target.classList.contains('deleteTask')) {
            const taskId = e.target.closest('tr').dataset.id;
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                e.target.closest('tr').remove();
            }
        }
    });

    function updateTaskList() {
        const searchTerm = searchInput.value;
        const priority = priorityFilter.value;
        const dueDate = dueDateFilter.value;

        fetch(`/tasks?search=${searchTerm}&priority=${priority}&dueDate=${dueDate}`)
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = tasks.map(task => `
                    <tr data-id="${task._id}">
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${task.priority}</td>
                        <td>${task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : 'No deadline'}</td>
                        <td>
                            <button class="btn btn-sm btn-warning toggleComplete">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                            <button class="btn btn-sm btn-danger deleteTask">Delete</button>
                        </td>
                    </tr>
                `).join('');
            });
    }

    searchInput.addEventListener('input', updateTaskList);
    priorityFilter.addEventListener('change', updateTaskList);
    dueDateFilter.addEventListener('change', updateTaskList);
});