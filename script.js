 let tasks = [];

        window.onload = () => {
            tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            renderTasks();
        };

        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const taskText = taskInput.value.trim();
            const taskDate = new Date().toISOString().split('T')[0]; // Today's date
            if (taskText) {
                // Add a new task at the end of the array, maintaining the order
                tasks.push({ text: taskText, completed: false, date: taskDate });
                saveTasks();
                renderTasks();
                taskInput.value = '';
            }
        }

        function renderTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            // Render tasks in the order they were added (no sorting or dynamic index)
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <input type="checkbox" onclick="toggleComplete(${index})" ${task.completed ? 'checked' : ''}>
                    <span>${index + 1}. ${task.text} (${task.date})</span>
                    <button class="delete-btn" onclick="deleteTask(${index})">❌</button>
                `;
                taskList.appendChild(li);
            });
        }

        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function toggleComplete(index) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        }

        function deleteTask(index) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }

        function downloadExcel() {
            const worksheet = XLSX.utils.json_to_sheet(tasks); // Include all tasks (completed and not completed)
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
            
            // Generate filename with current date
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
            const filename = `Tasks_${formattedDate}.xlsx`;
            
            // Generate Excel file and trigger download
            XLSX.writeFile(workbook, filename);
        }
