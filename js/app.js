const apiKey = "e1da30aa-1039-426b-8c67-da99e0ea8e4e";
const apiHost = "https://todo-api.coderslab.pl"

document.addEventListener("DOMContentLoaded", function () {
    function apiListTasks() {
        return fetch(apiHost + "/api/tasks", {
            headers: {
                "Authorization": apiKey
            }
        }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        });
    }

    function apiCreateTask(title, description) {
        return fetch(apiHost + "/api/tasks",
            {
                method: "POST",
                headers: {
                    "Authorization": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title: title, description: description, status: "open"})
            }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        });
    }

    function apiListOperationsForTask(taskId) {
        return fetch(apiHost + "/api/tasks/" + taskId + "/operations",
            {
                method: "GET",
                headers: {
                    "Authorization": apiKey
                }
            }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        });
    }

    function apiDeleteTask(taskId) {
        return fetch(apiHost + "/api/tasks/" + taskId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": apiKey
                }
            }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        });
    }

    function apiCreateOperationForTask(taskId, description) {
        return fetch(apiHost + "/api/tasks/" + taskId + "/operations",
            {
                method: "POST",
                headers: {
                    "Authorization": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({description: description, timeSpent: 0})
            }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        })
    }

    function apiUpdateOperation(operationId, description, timeSpent) {
        return fetch(apiHost + "/api/operations/" + operationId,
            {
                method: "PUT",
                headers: {
                    "Authorization": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({description: description, timeSpent: timeSpent})
            }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        });
    }

    function apiDeleteOperation(operationId) {
        return fetch(apiHost + "/api/operations/" + operationId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": apiKey
                }
            }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        });
    }

    function apiUpdateTask(taskId, title, description, status) {
        return fetch(apiHost + "/api/tasks/" + taskId,
            {
                method: "PUT",
                headers: {
                    "Authorization": apiKey,
                    "Content-Type": "application/json"
                },
            body: JSON.stringify({title: title, description: description, status: status})
        }).then(function (response) {
            if (!response.ok) {
                alert("Error! Unsuccessful fetch");
            }
            return response.json();
        });
    }

    function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
        const listElem = document.createElement("li");
        listElem.className = "list-group-item d-flex justify-content-between align-items-center";

        operationsList.appendChild(listElem);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.innerText = operationDescription;
        listElem.appendChild(descriptionDiv);

        const time = document.createElement("span");
        time.className = "badge badge-success badge-pill ml-2";
        time.innerText = convertTime(timeSpent);
        descriptionDiv.appendChild(time);

        if (status === "open") {
            const rightDescDiv = document.createElement('div');
            rightDescDiv.className = 'js-task-open-only';
            listElem.appendChild(rightDescDiv);

            const minBtn = document.createElement("button");
            minBtn.className = "btn btn-outline-success btn-sm ml-2";
            minBtn.innerText = "+15m";
            rightDescDiv.appendChild(minBtn);

            const hourBtn = document.createElement("button");
            hourBtn.className = "btn btn-outline-success btn-sm ml-2";
            hourBtn.innerText = "+1h";
            rightDescDiv.appendChild(hourBtn);

            const deleteTaskBtn = document.createElement("button");
            deleteTaskBtn.className = "btn btn-outline-danger btn-sm ml-2";
            deleteTaskBtn.innerText = "Delete";
            rightDescDiv.appendChild(deleteTaskBtn);

            minBtn.addEventListener("click", function () {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(function (response) {
                    time.innerText = convertTime(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                });
            });

            hourBtn.addEventListener("click", function () {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(function (response) {
                    time.innerText = convertTime(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                });
            });

            deleteTaskBtn.addEventListener("click", function () {
                apiDeleteOperation(operationId).then(function (response) {
                    listElem.remove();
                });
            });
        }
    }

    function convertTime(time) {
        const minutes = time % 60;
        const hours = Math.floor(time / 60);

        if (hours === 0) {
            return minutes + "m"
        }
        if (minutes === 0) {
            return hours + "h";
        }

        return (hours + "h " + minutes + "m");
    }

    function renderTask(taskId, title, description, status) {
        const section = document.createElement("section");
        section.className = "card mt-5 shadow-sm";
        document.querySelector("main").appendChild(section);

        const headerDiv = document.createElement("div");
        headerDiv.className = "card-header d-flex justify-content-between align-items-center";
        section.appendChild(headerDiv);

        const headerLeftDiv = document.createElement("div");
        headerDiv.appendChild(headerLeftDiv);

        const header5 = document.createElement("h5");
        header5.innerText = title;
        headerLeftDiv.appendChild(header5);

        const header6 = document.createElement("h6");
        header6.className = "card-subtitle text-muted";
        header6.innerText = description;
        headerLeftDiv.appendChild(header6);

        const headerRightDiv = document.createElement('div');
        headerDiv.appendChild(headerRightDiv);

        if (status === "open") {
            const finishBtn = document.createElement("button");
            finishBtn.className = "btn btn-dark btn-sm js-task-open-only";
            finishBtn.innerText = "Finish";
            headerRightDiv.appendChild(finishBtn);

            finishBtn.addEventListener("click", function (){
                apiUpdateTask(taskId, title, description, "closed");
                section.querySelectorAll(".js-task-open-only").forEach(function(element){
                    element.parentElement.removeChild(element);
                })
            })
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-outline-danger btn-sm ml-2";
        deleteBtn.innerText = "Delete";
        headerRightDiv.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", function () {
            apiDeleteTask(taskId).then(function () {
                section.remove();
            });
        });

        const taskList = document.createElement("ul");
        taskList.className = "list-group list-group-flush"
        section.appendChild(taskList);

        if (status === "open") {
            const addOperationDiv = document.createElement("div");
            addOperationDiv.className = "card-body js-task-open-only";
            section.appendChild(addOperationDiv);

            const form = document.createElement("form");
            addOperationDiv.appendChild(form);

            const inputDiv = document.createElement("div");
            inputDiv.className = "input-group";
            form.appendChild(inputDiv);

            const descriptionInput = document.createElement("input");
            descriptionInput.setAttribute("type", "text");
            descriptionInput.setAttribute("placeholder", "Operation description");
            descriptionInput.setAttribute("minlength", "5");
            descriptionInput.className = "form-control";
            inputDiv.appendChild(descriptionInput);

            const inputDivAppend = document.createElement("div");
            inputDivAppend.className = "input-group-append";
            inputDiv.appendChild(inputDivAppend);

            const addBtn = document.createElement("button");
            addBtn.className = "btn btn-info ml-2";
            addBtn.innerText = "Add";
            inputDivAppend.appendChild(addBtn);

            form.addEventListener("submit", function (event) {
                event.preventDefault();
                apiCreateOperationForTask(taskId, descriptionInput.value).then(function (response) {
                    renderOperation(taskList, status, response.data.id, response.data.description, response.data.timeSpent);
                });
            });
        }

        apiListOperationsForTask(taskId).then(function (response) {
            response.data.forEach(function (operation) {
                renderOperation(taskList, status, operation.id, operation.description, operation.timeSpent);
            });
        });
    }

    apiListTasks().then(function (response) {
        response.data.forEach(function (task) {
            renderTask(task.id, task.title, task.description, task.status);
        });
    });

    const addTaskForm = document.querySelector(".js-task-adding-form");
    addTaskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const inputs = addTaskForm.querySelectorAll("input");
        const title = inputs[0].value;
        const description = inputs[1].value;

        apiCreateTask(title, description).then(function (response) {
            const taskData = response.data;
            renderTask(taskData.id, taskData.title, taskData.description, taskData.status);
        });
    });


});
