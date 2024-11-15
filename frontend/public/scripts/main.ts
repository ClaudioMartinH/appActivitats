window.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("id");
  //console.log(userId);
  const userEmail = localStorage.getItem("email");
  //console.log(userEmail);
  const userName = localStorage.getItem("userDisplayFirstName");
  //console.log(userName);
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://appactivitats-production.up.railway.app";

  const fileInput = document.getElementById(
    "upload-task-file-input"
  ) as HTMLInputElement;
  const userNameField = document.getElementById("userName") as HTMLElement;
  //const userEmailField = document.getElementById("userEmail") as HTMLElement;
  const pendingTasks = document.getElementById(
    "pendingTaskList"
  ) as HTMLUListElement;
  const formElement = document.getElementById("uploadForm") as HTMLFormElement;
  const taskTitleInput = document.getElementById(
    "newTaskTitle"
  ) as HTMLInputElement;
  const taskDescriptionInput = document.getElementById(
    "newTaskDescription"
  ) as HTMLInputElement;
  const taskCapacityInput = document.getElementById(
    "newTaskCapacity"
  ) as HTMLInputElement;
  const addTaskButton = document.getElementById("addTask") as HTMLButtonElement;
  const allTasksList = document.getElementById(
    "allTaskList"
  ) as HTMLUListElement;
  const deleteUserButton = document.getElementById(
    "delete-user"
  ) as HTMLButtonElement;
  const editUserForm = document.getElementById(
    "edit-user-form"
  ) as HTMLFormElement;
  const downloadTasks = document.getElementById(
    "download-tasks"
  ) as HTMLButtonElement;

  if (
    !fileInput ||
    !taskTitleInput ||
    !taskDescriptionInput ||
    !taskCapacityInput ||
    !taskDescriptionInput ||
    !allTasksList ||
    !userNameField ||
    !downloadTasks ||
    !pendingTasks ||
    !formElement ||
    !addTaskButton ||
    !userId ||
    !deleteUserButton ||
    !editUserForm
  ) {
    console.error("One or more elements are missing");
    return;
  }
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!fileInput.files) {
      console.error("No file selected");
      return;
    }
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `${backendURL}/api/appActivitats/tasks/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          //console.log("Actividades importadas:", result);
          loadAndDisplayTasks();
        } else {
          console.error("Error al subir el archivo");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
  async function fetchTasks(): Promise<any[]> {
    try {
      const response = await fetch(`${backendURL}/api/appActivitats/tasks`);
      if (!response.ok) {
        throw new Error("Error al obtener las tareas");
      }
      const tasks = await response.json();
      if (!Array.isArray(tasks)) {
        console.error("La respuesta no es un array:", tasks);
        return [];
      }
      if (tasks.some((task: { id: any }) => !task.id)) {
        console.error("Algunas tareas no tienen id");
      }
      //console.log("Tareas obtenidas:", tasks);
      return tasks;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  if (editUserForm) {
    editUserForm.addEventListener("submit", async () => {
      //event.preventDefault();
      try {
        const firstName = (
          document.getElementById("firstNameEdited") as HTMLInputElement
        )?.value;
        const lastName = (
          document.getElementById("lastNameEdited") as HTMLInputElement
        )?.value;
        const age = (document.getElementById("ageEdited") as HTMLInputElement)
          ?.value;
        const email = (
          document.getElementById("emailEdited") as HTMLInputElement
        )?.value;
        const password = (
          document.getElementById("passwordEdited") as HTMLInputElement
        )?.value;

        //console.log("Valores del formulario:", {
        //   firstName,
        //   lastName,
        //   age,
        //   email,
        //   password,
        // });

        const response = await fetch(
          `${backendURL}/api/appActivitats/users/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              age,
              email,
              password,
            }),
          }
        );

        if (response.ok) {
          //console.log("Usuario editado correctamente");
          const updatedUser = await response.json();
          localStorage.setItem("id", updatedUser.id);
          localStorage.setItem("email", updatedUser.email);
          localStorage.setItem("userDisplayFirstName", updatedUser.firstName);
          renderUserName();
        } else {
          throw new Error("La respuesta del servidor no fue exitosa");
        }
      } catch (error) {
        console.error("Error al editar el usuario", error);
      }
    });
  } else {
    console.error(
      "El formulario de edición de usuario no se encontró en el DOM"
    );
  }
  document
    .getElementById("download-tasks")
    ?.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/appActivitats/download`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const linkDiv = document.getElementById("link");
        if (linkDiv) {
          // Limpiar el contenido previo del div
          linkDiv.innerHTML = "";

          // Crear el enlace de descarga
          const a = document.createElement("a");
          a.href = url;
          a.download = "activitats.json";
          a.textContent = "Descargar activitats.json";
          a.classList.add("card-span");
          linkDiv.appendChild(a);
          setTimeout(() => {
            linkDiv.innerHTML = "";
            window.URL.revokeObjectURL(url);
          }, 60000);
        } else {
          console.error('El div con id "link" no se encontró');
        }
      } catch (error) {
        console.error("Error al descargar las actividades:", error);
        alert(
          "Hubo un error al descargar las actividades. Por favor, inténtalo de nuevo."
        );
      }
    });
  // downloadTasks.addEventListener("click", async () => {
  //   try {
  //     const response = await fetch(`/api/appActivitats/tasks/download`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = URL.createObjectURL(blob);

  //       // Crear un enlace <a> pero no lo agregamos al DOM
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "activitats.json"; // Nombre del archivo

  //       // Ejecutar automáticamente la acción de "click" en el enlace
  //       a.style.display = "none"; // Asegurar que no sea visible
  //       document.body.appendChild(a); // Añadir temporalmente al DOM
  //       a.click(); // Iniciar descarga
  //       document.body.removeChild(a); // Eliminar del DOM una vez descargado

  //       // Limpiar la URL del objeto para evitar pérdidas de memoria
  //       URL.revokeObjectURL(url);
  //     } else {
  //       throw new Error("Error al descargar las tareas");
  //     }
  //   } catch (error) {
  //     console.error("Error al descargar las tareas", error);
  //   }
  // });

  deleteUserButton.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/appActivitats/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch {
      console.error("Error al eliminar el usuario");
      return;
    }
    window.location.href = `${backendURL}/api/login`;
  });
  function renderUserName() {
    userNameField.textContent = `${userName} - ${userEmail}`;
  }
  renderUserName();
  function renderPendingTasks(tasks: any[]) {
    pendingTasks.innerHTML = "";

    if (tasks.length === 0) {
      const noTasksMessage = document.createElement("p");
      noTasksMessage.textContent = "No tens tasques pendents.";
      pendingTasks.appendChild(noTasksMessage);
      return;
    }

    tasks.forEach((task) => {
      if (Array.isArray(task.participants)) {
        const isParticipant = task.participants.some((participant: string) => {
          if (typeof participant === "string") {
            const objectIdMatch = participant.match(/ObjectId\('(.+?)'\)/);
            if (objectIdMatch) {
              const participantId = objectIdMatch[1];
              return participantId === userId;
            }
            console.error(
              "Error al extraer ObjectId del participante:",
              participant
            );
            return false;
          }
          return false;
        });

        if (isParticipant) {
          const taskDiv = document.createElement("div");
          taskDiv.className = "task-item";
          const taskInfo = document.createElement("p");
          taskInfo.textContent = `${task.title}`;
          taskDiv.appendChild(taskInfo);
          pendingTasks.appendChild(taskDiv);
        }
      }
    });
  }
  function renderTasks(tasks: any[]) {
    allTasksList.innerHTML = "";

    if (tasks.length === 0) {
      const noTasksMessage = document.createElement("p");
      noTasksMessage.textContent = "No hi ha cap tasca disponible.";
      allTasksList.appendChild(noTasksMessage);
      return;
    }

    tasks.forEach((task) => {
      if (Array.isArray(task.participants)) {
        const freePlaces = task.capacity - task.participants.length;
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";
        const taskInfo = document.createElement("p");
        taskInfo.textContent = `${task.title}`;
        const taskDescription = document.createElement("p");
        taskDescription.textContent = `${task.description}`;
        const taskCapacity = document.createElement("p");
        taskCapacity.textContent = `Capacitat: ${task.capacity} pax`;
        const freeSpots = document.createElement("p");
        freeSpots.textContent = `Places lliures: ${freePlaces}`;
        const joinButton = document.createElement("button");
        joinButton.textContent = "Afegir";
        joinButton.className = "join-button";
        joinButton.addEventListener("click", () => handleJoin(task.id));
        const removeParticipantButton = document.createElement("button");
        removeParticipantButton.textContent = "Sortir";
        if (userId) {
          removeParticipantButton.addEventListener("click", () =>
            removeParticipant(task.id)
          );
        }
        removeParticipantButton.className = "quit-button";
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => handleDelete(task.id));
        taskDiv.appendChild(taskInfo);
        taskDiv.appendChild(taskDescription);
        taskDiv.appendChild(taskCapacity);
        taskDiv.appendChild(freeSpots);
        taskDiv.appendChild(joinButton);
        taskDiv.appendChild(removeParticipantButton);
        taskDiv.appendChild(deleteButton);
        allTasksList.appendChild(taskDiv);
      } else {
        console.error(
          `La tarea ${task.id} no tiene participantes definidos como un array.`
        );
      }
    });
  }
  function getUserId() {
    const userJoinId = localStorage.getItem("id");
    if (!userJoinId) {
      showTemporaryAlert("El ID del usuario no está disponible.");
      return null;
    }
    return userJoinId;
  }
  async function handleJoin(taskId: string) {
    const userJoinId = getUserId();
    //console.log(userJoinId);
    if (!userJoinId) {
      showTemporaryAlert("El ID del usuario no está disponible.", "#FFD700");
      return;
    }
    try {
      const response = await fetch(
        `${backendURL}/api/appActivitats/tasks/${taskId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userJoinId: userJoinId }),
        }
      );
      //console.log("Estado de la respuesta:", response.status);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          showTemporaryAlert("L'activitat és completa.", "#FFD700");
        } else if (response.status === 500) {
          showTemporaryAlert("Ja ets part de l'activitat.", "#FFD700");
        } else {
          throw new Error(data.message || "Error desconocido");
        }
        return;
      }

      if (data.tasks?.participants?.includes(userJoinId)) {
        showTemporaryAlert("Ja estàs afegit a l'activitat.");
      } else {
        showTemporaryAlert(
          "T'has afegit a l'activitat correctament.",
          "#4CAF50"
        );
      }

      await loadAndDisplayTasks();
    } catch (error) {
      console.error("Error al unir-se a l'activitat:", error);
      showTemporaryAlert(
        error instanceof Error
          ? error.message
          : "Error desconocido al unirse a la actividad"
      );
    }
  }

  async function handleDelete(taskId: string) {
    try {
      const response = await fetch(
        `${backendURL}/api/appActivitats/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showTemporaryAlert("Tarea eliminada exitosamente", "#4CAF50");
        loadAndDisplayTasks();
      } else {
        showTemporaryAlert("No se pudo eliminar la tarea", "#f44336");
        loadAndDisplayTasks();
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      showTemporaryAlert(
        "Ocurrió un error al intentar eliminar la tarea",
        "#4CAF50"
      );
    }
  }
  async function removeParticipant(taskId: string) {
    const participantId = getUserId();
    //console.log("user  id", participantId);
    if (!participantId) {
      showTemporaryAlert(
        "El ID del participant no está disponible.",
        "#4CAF50"
      );
      return;
    }
    try {
      const response = await fetch(
        `${backendURL}/api/appActivitats/tasks/${taskId}/remove/${participantId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //console.log("Estado de la respuesta:", response.status);
      if (response.ok) {
        showTemporaryAlert("Participant eliminat correctament", "#4CAF50");
        loadAndDisplayTasks();
      } else {
        showTemporaryAlert("No s'ha pogut eliminar el participant", "#f44336");
        loadAndDisplayTasks();
      }
    } catch (error) {
      console.error("Error a l'eliminar el participant:", error);
      showTemporaryAlert(
        "Ocurrió un error al intentar eliminar el participante",
        "#FFD700"
      );
      loadAndDisplayTasks();
    }
  }

  async function loadAndDisplayTasks() {
    const tasks = await fetchTasks();
    renderTasks(tasks);
    renderPendingTasks(tasks);
  }
  loadAndDisplayTasks();

  addTaskButton.addEventListener("click", async () => {
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const capacity = parseInt(taskCapacityInput.value);
    if (!title || !description || isNaN(capacity) || capacity <= 0) {
      showTemporaryAlert(
        "Tots els camps han de ser omplerts i la capacitat ha de ser més gran de 0.",
        "#4CAF50"
      );
      return;
    }
    try {
      const response = await fetch(`${backendURL}/api/appActivitats/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          capacity,
        }),
      });
      if (response.ok) {
        showTemporaryAlert("Activitat afegida correctament", "#4CAF50");
        taskTitleInput.value = "";
        taskDescriptionInput.value = "";
        taskCapacityInput.value = "";
        loadAndDisplayTasks();
      }
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  });
  function showTemporaryAlert(
    message: string | null,
    color = "#f44336",
    duration = 1000
  ) {
    const alertContainer = document.getElementById("alert-container");
    if (!alertContainer) {
      console.error("Elemento 'alert-container' no encontrado");
      return;
    }
    const alertElement = document.createElement("div");
    alertElement.className = "alert";
    alertElement.style.backgroundColor = color;
    alertElement.textContent = message;
    alertContainer.appendChild(alertElement);

    setTimeout(() => {
      alertElement.classList.add("hide");
    }, duration);

    setTimeout(() => {
      alertElement.remove();
    }, duration + 500);
  }
  document.addEventListener("click", (event: MouseEvent) => {
    const form = document.querySelector<HTMLElement>(".edit-user-form");
    const toggleCheckbox = document.getElementById(
      "edit-toggle"
    ) as HTMLInputElement;

    if (
      form &&
      toggleCheckbox &&
      !form.contains(event.target as Node) &&
      !toggleCheckbox.contains(event.target as Node)
    ) {
      toggleCheckbox.checked = false;
    }
  });
  renderUserName();
});
