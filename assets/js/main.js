const openRegFormBtn = document.querySelector("#open-reg-form");

function dynamicModalActions(selector) {
	const modal = document.querySelector(selector);
	if (modal) {
		modal.classList.add("open");

		const closeBtn = modal.querySelector(".modal-close");

		closeBtn.addEventListener("click", () => {
			modal.classList.remove("open");
		});
	}
}

openRegFormBtn.addEventListener("click", () => {
	dynamicModalActions("#reg-modal");
});

const createUserUrl = "https://borjomi.loremipsum.ge/api/register", //method POST  ყველა ველი სავალდებულო
	getAllUsersUrl = "https://borjomi.loremipsum.ge/api/all-users", //method GET
	getSingleUserUrl = "https://borjomi.loremipsum.ge/api/get-user/1 ", //id, method  GET
	updateUserUrl = "https://borjomi.loremipsum.ge/api/update-user/1 ", //id, method PUT
	deleteUserUrl = "https://borjomi.loremipsum.ge/api/delete-user/1"; //id, method DELETE

const regForm = document.querySelector("#reg"),
	userName = document.querySelector("#user_name"),
	userSurname = document.querySelector("#user_surname"),
	userEmail = document.querySelector("#user_email"),
	userPhone = document.querySelector("#user_phone"),
	userPersonalID = document.querySelector("#user_personal-id"),
	userZip = document.querySelector("#user_zip-code"),
	userGender = document.querySelector("#user_gender"),
	// user id ფორმში, რომელიც გვჭირდება დაედითებისთვის
	user_id = document.querySelector("#user_id"),
	userTableBody = document.querySelector("#user-rows"),
	regFormCloseBtn = document.querySelector(".modal-close");

// const user = {
// 	first_name: "steso",
// 	last_name: "text",
// 	phone: "123456789",
// 	id_number: "12345678909",
// 	email: "text@gmail.com",
// 	gender: "male",
// 	zip_code: "1245",
// };

// new Promise((resolve, reject)=>{

// })

// TODO: დაასრულეთ შემდეგი ფუნქციები
function renderUsers(usersArray) {
	// TODO: usersArray არის სერვერიდან დაბრუნებული ობიექტების მასივი
	// TODO: ამ მონაცმების მიხედვით html ში ჩასვით ცხრილი როგორც "ცხრილი.png" შია

	console.log(usersArray);

	const userRows = usersArray.map((user) => {
		return `
					<tr>
						<td>${user.id}</td>
						<td>${user.first_name}</td>
						<td>${user.last_name}</td>
						<td>${user.email}</td>
						<td>${user.id_number}</td>
						<td>${user.phone}</td>
						<td>${user.zip_code}</td>
						<td>${user.gender}</td>
						<td>
								<button class="edit btn" type="button" data-user-id="${user.id}" data-name="satesto">Edit</button>
								<button class="dlt btn" type="button" data-user-id="${user.id}">Delete</button>
						</td>
					</tr>`;
	});
	userTableBody.innerHTML = userRows.join("");
	userActions(); // ყოველ რენდერზე ახლიდან უნდა მივაბათ ივენთ ლისნერები
}

function userActions() {
	// 1. ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
	// 2. იქნება 2 ღილაკი რედაქტირება და წაშლა როგორც "ცხრილი.png" ში ჩანს
	// 3. id შეინახეთ data-user-id ატრიბუტად ღილაკებზე, data ატრიბუტებზე წვდომა შეგიძლიათ dataset-ის გამოყენებით მაგ:selectedElement.dataset
	// 4. წაშლა ღილაკზე დაჭერისას უნდა გაიგზავნოს წაშლის მოთხოვნა (deleteUser ფუნქციის მეშვეობით) სერვერზე და გადაეცეს id
	// 5. ედიტის ღილაკზე უნდა გაიხსნას მოდალი სადაც ფორმი იქნება იმ მონაცემებით შევსებული რომელზეც მოხდა კლიკი. ედიტის ღილაკზე უნდა გამოიძახოთ getUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს და არა მასივს)  ეს დატა უნდა შეივსოს ფორმში და ამის შემდეგ შეგიძლიათ დააედიტოთ ეს ინფორმაცია და ფორმის დასაბმითებისას უნდა მოხდეს updateUser() ფუნქციის გამოძახება, სადაც გადასცემთ განახლებულ იუზერის ობიექტს, გვჭირდება იუზერის აიდიც, რომელიც  მოდალის გახსნისას user_id-ის (hidden input არის და ვიზუალურად არ ჩანს) value-ში შეგიძლიათ შეინახოთ

	const editBtns = document.querySelectorAll(".edit");
	const deleteBtns = document.querySelectorAll(".dlt");

	editBtns.forEach((btn) => {
		btn.addEventListener("click", async (e) => {
			const data = await getUser(btn.dataset.userId);

			console.log(data);

			fillForm(data.users);

			dynamicModalActions("#reg-modal");
		});
	});

	deleteBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			// console.log(btn.dataset.userId, "delete");
			const id = btn.dataset.userId;
			deleteUser(id);
		});
	});
}

function getUsers() {
	fetch("https://borjomi.loremipsum.ge/api/all-users")
		.then((res) => {
			// console.log(res);
			return res.json();
		})
		.then((data) => {
			console.log(data);
			const users = data.users;
			// console.log(users);

			// html-ში გამოტანა მონაცემების
			renderUsers(users);
		})
		.catch((error) => {
			console.log(error);
		});
}

function deleteUser(id) {
	fetch(`https://borjomi.loremipsum.ge/api/delete-user/${id}`, {
		method: "delete",
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			// გვიბრუნებს სტატუსს
			getUsers(); // შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან უნდა წამოვიღოთ დატა
			// ამიტომ აქ ყველგან დაგვჭირდება უბრალოდ ამ ფუნქციის გამოძახება, რომელიც ხელახლა გადახატავს ინფორმაციას
		})
		.catch((error) => {
			console.log(error);
		});
}

async function getUser(id) {
	try {
		const response = await fetch(
			`https://borjomi.loremipsum.ge/api/get-user/${id}`
		);
		const data = await response.json();

		return data;
		// console.log(data);
	} catch (e) {
		console.log("Error - ", e);
	}
}

function fillForm(user) {
	userName.value = user.first_name;
	userSurname.value = user.last_name;
	userEmail.value = user.email;
	userPhone.value = user.phone;
	userPersonalID.value = user.id_number;
	userZip.value = user.zip_code;
	userGender.value = user.gender;
	user_id.value = user.id;
}

function updateUser(user) {
	// მიიღებს დაედითებულ ინფორმაციას და გააგზავნით სერვერზე
	// TODO დაასრულეთ ფუნქცია
	//  method: "put",  https://borjomi.loremipsum.ge/api/update-user/${userData.id}
	// TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა

	fetch(`http://borjomi.loremipsum.ge/api/update-user/${user.id}`, {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			getUsers();

			user_id.value = "";
			regForm.reset();
			//ფორმის დახურვა
			regFormCloseBtn.click();
		})
		.catch((e) => {
			console.log("error", e);
		});
}

function createUser(userData) {
	fetch("https://borjomi.loremipsum.ge/api/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			// გვიბრუნებს სტატუსს (წარმატებით გაიგზავნა თუ არა) და დამატებული იუზერის ობიექტს
			// დატის მიღების შემდეგ ვწერთ ჩვენს კოდს
			// შენახვის, ედიტირების და წაშლის შემდეგ ხელახლა გამოგვაქვს ყველა იუზერი
			getUsers();
			user_id.value = "";
			regForm.reset();

			// ფორმის დახურვა
			regFormCloseBtn.click();
		})
		.catch((err) => {
			console.log(err);
		});
}

getUsers();
regForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const user = {
		id: user_id.value, //ეს #user_id hidden input გვაქვს html-ში და ამას გამოვიყენებთ მხოლოდ დაედითებისთვის
		first_name: userName.value,
		last_name: userSurname.value,
		phone: userPhone.value,
		id_number: userPersonalID.value,
		email: userEmail.value,
		gender: userGender.value,
		zip_code: userZip.value,
	};

	// console.log(user);
	// createUser(user);

	//  TODO: თუ user_id.value არის ცარიელი (თავიდან ცარიელია) მაშინ უნდა შევქმნათ  -->  createUser(user);
	// თუ დაედითებას ვაკეთებთ, ჩვენ ვანიჭებთ ამ მნიშვნელობას userActions ფუნქციაში
	// TODO: თუ user_id.value არის (არაა ცარიელი სტრინგი) მაშინ უნდა დავაედიტოთ, (როცა ფორმს ედითის ღილაკის შემდეგ იუზერის ინფუთით ვავსებთ, ვაედითებთ და ვასაბმითებთ) -->  updateUser(user);

	// form.reset();

	if (user.id) {
		console.log("update");
		updateUser(user);
	} else {
		console.log("add new");
		createUser(user);
	}
});
