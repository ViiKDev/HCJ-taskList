const inputNewTask = document.querySelector('#inputNewTask')
const btnAddTask = document.querySelector('#btnAddTask')
const btnEditModalClose = document.querySelector('#btnEditModalClose')
const btnUpdateTask = document.querySelector('#btnUpdateTask')
const taskList = document.querySelector('#taskList')
const editTaskId = document.querySelector('#editTaskId')
const inputTaskNameEdit = document.querySelector('#inputTaskNameEdit')
const KEY_CODE_ENTER = 13
let modalOpen = 0
let lSTasks = getListsFromLS()
let taskCreateId = localStorage.getItem('totalTasks') ? localStorage.getItem('totalTasks') : 1
let pageTasks = []

renderTaskList()

inputNewTask.addEventListener('keypress', (e) => {
    if (e.keyCode == KEY_CODE_ENTER) {
        let task = {
            name: inputNewTask.value,
            id: taskCreateId
        }
        if (task.name.length > 0) {
            addTask(task)
        }
    }
})

btnAddTask.addEventListener('click', () => {
    let task = {
        name: inputNewTask.value,
        id: taskCreateId
    }
    if (task.name.length > 0) {
        addTask(task)
    }
})

btnEditModalClose.addEventListener('click', () => {
    toggleModal()
})

btnUpdateTask.addEventListener('click', (e) => {
    e.preventDefault()
    if (inputTaskNameEdit.value.length > 0) {
        inputTaskNameEdit.classList.remove('error')
        let taskId = editTaskId.innerHTML.replace('#', '')

        let task = {
            name: inputTaskNameEdit.value,
            id: taskId
        }

        let actualTask = document.getElementById('' + taskId + '')

        if (actualTask) {

            const taskIndex = lSTasks.findIndex(t => t.id == taskId)
            lSTasks[taskIndex] = task
            updateLS()

            let li = createLi(task)
            taskList.replaceChild(li, actualTask)
        } else {
            alert('Sorry, something went wrong!')
        }

        toggleModal()
    } else {
        inputTaskNameEdit.classList.add('error')
    }
})

// function generateId() { This could repeat ids
//     return Math.floor(Math.random() * 3000)
// }

// function addTask(task) { JQuery
//     ('#taskList').append(
//         `
//         <li>
//             <span class="taskText">${task.name}</span>
//             <div>
//                 <button class="btnAction">
//                     <i class="fa fa-pencil"></i>
//                 </button>
//                 <button class="btnAction">
//                     <i class="fa fa-trash"></i>
//                 </button>
//             </div>
//         </li>
//         `
//     )
// }

function addTask(task) {
    lSTasks.push(task)
    updateLS()
    renderTaskList()
    taskCreateId++
    localStorage.setItem('totalTasks', taskCreateId)
}

function createLi(task) {
    let li = document.createElement('li')
    li.id = task.id

    let span = document.createElement('span')
    span.classList.add('taskText')
    span.innerHTML = task.name

    let div = document.createElement('div')

    let btnEdit = document.createElement('button')
    btnEdit.classList.add('btnAction')
    btnEdit.innerHTML = '<i class="fa fa-pencil"></i>'
    btnEdit.setAttribute('onclick', 'editTask(' + task.id + ')')

    let btnDelete = document.createElement('button')
    btnDelete.classList.add('btnAction')
    btnDelete.innerHTML = '<i class="fa fa-trash"></i>'
    btnDelete.setAttribute('onclick', 'deleteTask(' + task.id + ')')

    div.appendChild(btnEdit)
    div.appendChild(btnDelete)

    li.appendChild(span)
    li.appendChild(div)

    return li
}

function editTask(taskId) {
    let li = document.getElementById(`${taskId}`)
    if (li) {
        editTaskId.innerHTML = '#' + taskId
        inputTaskNameEdit.value = li.children[0].innerHTML
        toggleModal()
    } else {
        alert('Sorry, something went wrong!')
    }
}

function deleteTask(taskId) {
    let confirm = window.confirm("Are you sure you want to delete this task?")
    if (confirm) {
        const taskIndex = lSTasks.findIndex(t => t.id == taskId)
        lSTasks.splice(taskIndex, 1)
        updateLS()
        let li = document.getElementById(`${taskId}`)
        if (li) {

            taskList.removeChild(li)
        } else {
            alert('Sorry, something went wrong!')
        }

    }
}

function toggleModal() {
    if (modalOpen == 0) {
        modalOpen = 1
        document.documentElement.style.setProperty('--modal-open', 'block')
    } else {
        modalOpen = 0
        document.documentElement.style.setProperty('--modal-open', 'none')
    }
}

function renderTaskList() {
    taskList.innerHTML = ''
    for (let i = 0; i < lSTasks.length; i++) {
        let li = createLi(lSTasks[i])
        taskList.appendChild(li)
    }
    inputNewTask.value = ''
}

function getListsFromLS() {
    if (localStorage.getItem('taskList')) {
        return JSON.parse(localStorage.getItem('taskList'))
    } else {
        return [{ name: 'My First Task', id: 0 }]
    }
}

function updateLS() {
    localStorage.setItem('taskList', JSON.stringify(lSTasks))
}