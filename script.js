let tasks = []; // Lista de tareas
let urgentTasks = []; // Lista de tareas urgentes
let actionHistory = []; // Historial de acciones

// Función para agregar una tarea
function addTask() {
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due-date').value;
    const category = document.getElementById('task-category').value;

    const task = {
        title,
        desc,
        priority: parseInt(priority),
        dueDate,
        category
    };

    // Si la tarea es urgente, se agrega a la lista de tareas urgentes
    if (priority === "4") {
        urgentTasks.push(task);
        displayUrgentTasks();
    } else {
        tasks.push(task);
        // Ordenar las tareas por prioridad y fecha de vencimiento
        tasks.sort((a, b) => a.priority - b.priority || new Date(a.dueDate) - new Date(b.dueDate));
        displayTasks();
    }

    // Agregar la acción al historial
    actionHistory.push({ action: 'add', task });
    displayTaskTree(); // Actualizar el árbol de tareas
    clearForm(); // Limpiar el formulario
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-priority').value = '1';
    document.getElementById('task-due-date').value = '';
    document.getElementById('task-category').value = 'work';
}

// Función para mostrar la lista de tareas
function displayTasks() {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const priorityClass = `priority-${task.priority}`;
        const priorityText = getPriorityText(task.priority);
        li.innerHTML = `<span class="priority ${priorityClass}">${priorityText}</span>${task.title} (Vencimiento: ${task.dueDate})
                        <button class="remove-task" onclick="removeTask(${index})">Eliminar</button>`;
        taskList.appendChild(li);
    });
}

// Función para obtener el texto de la prioridad
function getPriorityText(priority) {
    switch(priority) {
        case 1: return 'Baja';
        case 2: return 'Media';
        case 3: return 'Alta';
        case 4: return 'Urgente';
        default: return 'Desconocida';
    }
}

// Función para eliminar una tarea de la lista
function removeTask(index) {
    const task = tasks.splice(index, 1)[0];
    actionHistory.push({ action: 'remove', task });
    displayTasks();
    displayTaskTree(); // Actualizar el árbol de tareas
}

// Función para mostrar la lista de tareas urgentes
function displayUrgentTasks() {
    const urgentTaskList = document.getElementById('urgent-tasks');
    urgentTaskList.innerHTML = '';
    urgentTasks.forEach((task, index) => {
        const li = document.createElement('li');
        const priorityText = getPriorityText(task.priority);
        li.innerHTML = `<span class="priority priority-4">${priorityText}</span>${task.title} (Vencimiento: ${task.dueDate})
                        <button class="remove-task" onclick="removeUrgentTask(${index})">Eliminar</button>`;
        urgentTaskList.appendChild(li);
    });
}

// Función para eliminar una tarea urgente
function removeUrgentTask(index) {
    const task = urgentTasks.splice(index, 1)[0];
    actionHistory.push({ action: 'remove', task });
    displayUrgentTasks();
    displayTaskTree(); // Actualizar el árbol de tareas
}

// Función para mostrar el árbol de tareas
function displayTaskTree() {
    const taskTree = document.getElementById('task-tree-list');
    taskTree.innerHTML = '';

    const categories = {};

    // Agrupar las tareas por categoría
    tasks.concat(urgentTasks).forEach(task => {
        if (!categories[task.category]) {
            categories[task.category] = [];
        }
        categories[task.category].push(task);
    });

    // Crear el árbol de categorías y subcategorías
    for (const category in categories) {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<strong>${getCategoryText(category)}</strong>`;
        const sublist = document.createElement('ul');
        categories[category].forEach(task => {
            const subItem = document.createElement('li');
            subItem.innerHTML = `${task.title} (Vencimiento: ${task.dueDate}, Prioridad: ${getPriorityText(task.priority)})`;
            sublist.appendChild(subItem);
        });
        categoryItem.appendChild(sublist);
        taskTree.appendChild(categoryItem);
    }
}

// Función para obtener el texto de la categoría
function getCategoryText(category) {
    switch(category) {
        case 'work': return 'Trabajo';
        case 'personal': return 'Personal';
        case 'study': return 'Estudio';
        default: return 'Desconocida';
    }
}

// Inicializar vistas al cargar la página
displayTasks();
displayUrgentTasks();
displayTaskTree();
