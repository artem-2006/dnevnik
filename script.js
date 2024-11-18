document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.getElementById("login-form");
	const studentSection = document.getElementById("student-section");
	const teacherSection = document.getElementById("teacher-section");
	const teacherEntryForm = document.getElementById("teacher-entry-form");
	const studentEntriesList = document.getElementById("student-entries-list");
	const teacherEntriesList = document.getElementById("teacher-entries-list");
	const teacherDateInput = document.getElementById("teacher-date");

	// Пример данных для аутентификации
	const users = {
		student: { login: "уу", password: "уу" },
		teacher: { login: "тт", password: "тт" },
	};

	let currentRole = null; // Переменная для отслеживания текущей роли

	// Установка текущей даты в поле ввода даты
	const today = new Date().toISOString().split("T")[0];
	teacherDateInput.value = today;

	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const role = document.getElementById("role").value;
		const login = document.getElementById("login").value;
		const password = document.getElementById("password").value;

		if (users[role] && users[role].login === login && users[role].password === password) {
			loginForm.style.display = "none";
			currentRole = role; // Сохраняем текущую роль

			if (role === "student") {
				studentSection.style.display = "block";
				teacherSection.style.display = "none";
				loadStudentEntries();
				history.pushState({ role: "student" }, "Ученик", "/student");
			} else if (role === "teacher") {
				teacherSection.style.display = "block";
				studentSection.style.display = "none";
				loadTeacherEntries();
				history.pushState({ role: "teacher" }, "Учитель", "/teacher");
			}
		} else {
			alert("Неверный логин или пароль.");
		}
	});

	teacherEntryForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const firstName = document.getElementById("teacher-firstName").value;
		const lastName = document.getElementById("teacher-lastName").value;
		const className = document.getElementById("teacher-className").value;
		const date = teacherDateInput.value;
		const subject = document.getElementById("teacher-subject").value;
		const grade = document.getElementById("teacher-grade").value;
		const attendance = document.getElementById("teacher-attendance").checked;
		const homework = document.getElementById("teacher-homework").value;

		if (firstName && lastName && className && date && subject && grade && homework) {
			const entry = { firstName, lastName, className, date, subject, grade, attendance, homework };

			// Добавление записи в список
			addEntryToList(entry, teacherEntriesList);

			// Сохранение записи в localStorage
			const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];
			savedEntries.push(entry);
			localStorage.setItem("entries", JSON.stringify(savedEntries));

			teacherEntryForm.reset();
			teacherDateInput.value = today; // Восстановление текущей даты после сброса формы
		} else {
			alert("Пожалуйста, заполните все поля.");
		}
	});

	function loadStudentEntries() {
		const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];
		savedEntries.forEach((entry) => {
			addEntryToList(entry, studentEntriesList);
		});
	}

	function loadTeacherEntries() {
		const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];
		savedEntries.forEach((entry) => {
			addEntryToList(entry, teacherEntriesList);
		});
	}

	function addEntryToList(entry, list) {
		const row = document.createElement("tr");
		row.innerHTML = `
            <td>${entry.firstName}</td>
            <td>${entry.lastName}</td>
            <td>${entry.className}</td>
            <td>${entry.date}</td>
            <td>${entry.subject}</td>
            <td>${entry.grade}</td>
            <td>${entry.attendance ? "Присутствовал" : "Отсутствовал"}</td>
            <td>${entry.homework}</td>
            ${
							currentRole === "teacher"
								? '<td><button class="btn btn-danger btn-sm delete-entry-btn">Удалить</button></td>'
								: ""
						}
        `;
		list.appendChild(row);

		// Обработчик для кнопки удаления записи, только для учителей
		if (currentRole === "teacher") {
			row.querySelector(".delete-entry-btn").addEventListener("click", () => {
				deleteEntry(entry, list, row);
			});
		}
	}

	function deleteEntry(entry, list, row) {
		// Удалить запись из таблицы
		list.removeChild(row);

		// Получить сохраненные записи из localStorage
		const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];

		// Фильтровать записи, чтобы удалить ту, которую нажали
		const updatedEntries = savedEntries.filter(
			(savedEntry) =>
				!(
					savedEntry.firstName === entry.firstName &&
					savedEntry.lastName === entry.lastName &&
					savedEntry.className === entry.className &&
					savedEntry.date === entry.date &&
					savedEntry.subject === entry.subject &&
					savedEntry.grade === entry.grade &&
					savedEntry.attendance === entry.attendance &&
					savedEntry.homework === entry.homework
				)
		);

		// Обновить localStorage с оставшимися записями
		localStorage.setItem("entries", JSON.stringify(updatedEntries));
	}

	window.addEventListener("popstate", (event) => {
		if (event.state && event.state.role) {
			loginForm.style.display = "none";
			if (event.state.role === "student") {
				studentSection.style.display = "block";
				teacherSection.style.display = "none";
			} else if (event.state.role === "teacher") {
				teacherSection.style.display = "block";
				studentSection.style.display = "none";
			}
		} else {
			loginForm.style.display = "block";
			studentSection.style.display = "none";
			teacherSection.style.display = "none";
		}
	});
});
