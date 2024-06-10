document.addEventListener('DOMContentLoaded', function() {
    const submitTaskButton = document.getElementById('submitTask');
    const taskInput = document.getElementById('taskInput');
    const priorityLevel = document.getElementById('priorityLevel');
    const dueDateInput = document.getElementById('dueDate');
    const todoTable = document.getElementById('todoTable').getElementsByTagName('tbody')[0];
    const doneList = document.getElementById('doneList');
    const deleteAllButton = document.getElementById('deleteAll');
   
    function sortTodoTable() {
        const rows = Array.from(todoTable.rows);

        rows.sort((a, b) => {
            const priorityOrder = ['high', 'medium', 'low', 'late', 'done'];
            const priorityA = priorityOrder.indexOf(a.classList[0]);
            const priorityB = priorityOrder.indexOf(b.classList[0]);
            return priorityA - priorityB;
        });
        rows.forEach(row => todoTable.appendChild(row));
    }
    function checkForLateTasks() {
        const rows = Array.from(todoTable.rows);
        const now = new Date();
        rows.forEach(row => {
            const dueDateCell = row.cells[3];
            const statusCell = row.cells[4]
            if (dueDateCell) {
                const dueDateText = dueDateCell.textContent.trim();
                const [datePart, timePart] = dueDateText.split(' ');
                const [day, month, year] = datePart.split('/');
                const [hour, minute, second] = timePart.split(':');
                const dueDate = new Date(year, month - 1, day, hour, minute, second);
                 
                if (now > dueDate && !row.classList.contains('done')) {
                    row.classList.remove('low', 'medium', 'high');
                  
                    row.classList.add('late');
                    statusCell.textContent = "Late";
                }
                else if (!row.classList.contains('done')){
                    
                    row.classList.add('success');
                    statusCell.textContent = "Overdue";
                }
                else{
                    statusCell.textContent = "Finished";
                }
            }
        });
        sortTodoTable();
    }
    

    submitTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        const priority = priorityLevel.value;
        const dueDate = new Date(dueDateInput.value);
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
       
        if (taskText !== '' && dueDateInput.value) {
            const newRow = todoTable.insertRow();
            newRow.classList.add(priority);

            const taskCell = newRow.insertCell(0);
            const priorityCell = newRow.insertCell(1);
            const dateCell = newRow.insertCell(2);
            const dueDateCell = newRow.insertCell(3);
            const statusCell = newRow.insertCell(4);
            const actionCell = newRow.insertCell(5);

            taskCell.textContent = taskText;
            priorityCell.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
            dateCell.textContent = dateString;
            dueDateCell.textContent = dueDate.toLocaleDateString() + ' ' + dueDate.toLocaleTimeString();
            statusCell.textContent = 'Pending';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            actionCell.appendChild(checkbox);

            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    newRow.classList.remove(priority);
                    newRow.classList.remove("late");
                    newRow.classList.remove("success");
                    newRow.classList.add('done');
                 
                    sortTodoTable();
                    taskCell.style.textDecoration = 'line-through';
                    priorityCell.style.textDecoration = 'line-through';
                    dateCell.style.textDecoration = 'line-through';
                    dueDateCell.style.textDecoration = 'line-through';
                    statusCell.style.textDecoration = 'line-through';
                   
                   
                    const doneTask = document.createElement('li');
                    const currentDate = new Date();
                    if (currentDate < dueDate) {
                        const newdateString = 'Selesai Pada: ' + currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
                        doneTask.innerHTML = `${taskText} - ${newdateString} - <span class="success">KERJA BAGUS!</span>`;
                    } else {
                        const newdateString = 'Selesai Pada: ' + currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
                        doneTask.innerHTML = `${taskText} - ${newdateString} - <span class="late">KAMU TELAT!</span>`;
                    }
                    

                  
                    doneList.appendChild(doneTask);

                    checkbox.disabled = true;
                }
            });
        
            sortTodoTable();
            taskInput.value = '';
            priorityLevel.value = 'low';
            dueDateInput.value = '';
        }else {
            alert('Tolong Isi Task atau Waktu Deadline.');
        }
    });

    deleteAllButton.addEventListener('click', function() {
        todoTable.innerHTML = '';
        doneList.innerHTML = '';
        hint.style.display = 'inline-block';
    });

    //interval 1 detik untuk ngecheck sudah lewat deadline atau tidak, hijau = aman, merah = telat
    setInterval(checkForLateTasks, 1000);  

    
   
});
