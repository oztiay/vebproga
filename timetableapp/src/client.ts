export const renderPage = (): string => `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Расписание занятий</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <h1 class="mb-3">Расписание занятий</h1>


    <div class="mb-2">Чтобы добавить или изменить предмет в расписании, воспользуйтесь формой:</div>
    <form id="editForm" class="mb-3">
      <input type="hidden" id="editId" name="id"> <!-- Скрытое поле для ID редактируемой записи -->
      <div class="mb-2">
        <label for="editTitle" class="form-label">название: </label>
        <input type="text" id="editTitle" name="title" required />
      </div>
      <div class="mb-2">
        <label for="editClassroom" class="form-label">аудитория: </label>
        <input type="text" id="editClassroom" name="classroom"/>
      </div>
      <div class="mb-2">
        <label for="editTeacher" class="form-label">преподаватель: </label>
        <input type="text" id="editTeacher" name="teacher" />
      </div>
      <div class="mb-2">
        <label for="editDate" class="form-label">день: </label>
        <input type="date" id="editDate" name="date" required />
      </div>
      <div class="mb-2">
        <label for="editTime" class="form-label">начало и конец: </label>
        <select id="editTime" name="time" required>
          <option value="09:00 - 10:30">9:00 - 10:30</option>
          <option value="10:40 - 12:10">10:40 - 12:10</option>
          <option value="12:55 - 14:25">12:55 - 14:25</option>
          <option value="14:35 - 16:05">14:35 - 16:05</option>
          <option value="16:15 - 17:45">16:15 - 17:45</option>
          <option value="17:55 - 19:25">17:55 - 19:25</option>
        </select>
      </div>
      <button type="submit" id="submitButton" class="btn btn-primary ms-2">готово</button>
      <button type="button" id="cancelButton" class="btn btn-secondary ms-2" style="display: none;">отмена</button>
    </form>

    <div class="mb-3">
      <label for="dateFilter" class="form-label">выберите дату:</label>
      <input type="date" id="dateFilter">
      <button id="showAllButton" class="btn btn-secondary ms-2">показать все</button>
    </div>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>название предмета</th>
          <th>аудитория</th>
          <th>преподаватель</th>
          <th>дата</th>
          <th>время</th>
          <th>действия</th>
        </tr>
      </thead>
      <tbody id="scheduleTableBody"/>
    </table>
  </div>


  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const tableBody = document.getElementById("scheduleTableBody");
      const editForm = document.getElementById("editForm");
      const submitButton = document.getElementById("submitButton");
      const cancelButton = document.getElementById("cancelButton");
      const dateFilter = document.getElementById("dateFilter");
      const showAllButton = document.getElementById("showAllButton");

      let isEditing = false;


      const updateTable = async (selectedDate = null) => {
        const url = selectedDate ? \`/api/schedule/by-date?date=\${selectedDate}\` : "/api/schedule";
        const response = await fetch(url);
        const schedules = await response.json();

        tableBody.innerHTML = "";
        schedules.forEach((schedule) => {
          const row = document.createElement("tr");
          row.innerHTML = \`
            <td>\${schedule.title}</td>
            <td>\${schedule.classroom}</td>
            <td>\${schedule.teacher}</td>
            <td>\${schedule.date}</td>
            <td>\${schedule.time}</td>
            <td>
              <button class="btn btn-outline-primary btn-sm me-1" onclick="editSchedule(\${schedule.id})">изменить</button>
              <button class="btn btn-outline-danger btn-sm" onclick="deleteSchedule(\${schedule.id})">удалить</button>
            </td>
          \`;
          tableBody.appendChild(row);
        });
      };


      showAllButton.addEventListener("click", () => {
        dateFilter.value = "";
        updateTable();
      });


      dateFilter.addEventListener("change", () => {
        if (dateFilter.value) {
          updateTable(dateFilter.value);
        }
      });


      window.editSchedule = async (id) => {
        const response = await fetch(\`/api/schedule/\${id}\`);
        const schedule = await response.json();


        document.getElementById("editId").value = schedule.id;
        document.getElementById("editTitle").value = schedule.title;
        document.getElementById("editClassroom").value = schedule.classroom;
        document.getElementById("editTeacher").value = schedule.teacher;
        document.getElementById("editDate").value = schedule.date;
        document.getElementById("editTime").value = schedule.time;


        submitButton.textContent = "сохранить";
        cancelButton.style.display = "inline-block";
        isEditing = true;
      };


      cancelButton.addEventListener("click", () => {
        editForm.reset();
        submitButton.textContent = "готово";
        cancelButton.style.display = "none";
        isEditing = false;
      });


      editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const data = Object.fromEntries(formData.entries());


        const url = isEditing 
          ? \`/api/schedule/\${data.id}\` 
          : "/api/schedule";
        const method = isEditing ? "PUT" : "POST";


        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });


        editForm.reset();
        submitButton.textContent = "готово";
        cancelButton.style.display = "none";
        isEditing = false;
        updateTable();
      });


      window.deleteSchedule = async (id) => {
        if (confirm("Вы уверены, что хотите удалить эту запись?")) {
          await fetch(\`/api/schedule/\${id}\`, { method: "DELETE" });
          updateTable();
        }
      };


      updateTable();
    });
  </script>
</body>
</html>
`;