const allCarsDiv = document.getElementById('all-cars-content')
const carByIdDiv = document.getElementById('car-by-id')
const newCarDiv = document.getElementById('new-car-div')
const editCarDiv = document.getElementById('edit-car-div')

const buttonGetAll = document.getElementById('btn-get-all')
buttonGetAll.onclick = getAllCars

const buttonGetCarById = document.getElementById('find-by-id')
buttonGetCarById.onclick = displayCarById

const buttonAddNewCar = document.getElementById('add-new-car')
buttonAddNewCar.onclick = addNewCar

const buttonEditCar = document.getElementById('find-car-to-edit-by-id')
buttonEditCar.onclick = displayEditableCarById

function getAllCars() {
	fetch('http://127.0.0.1:8080/api/cars', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		if (!response.ok) {
			return new Promise.reject('error', response.status)
		}

		return response.json()
	})
	.then(data => {
		
		const carTable = `
				<table>
					<thead>
						<tr>
							<th>Id</th>
							<th>Brand</th>
							<th>Model</th>
							<th>Price per day</th>
							<th>Best discount</th>
						</tr>
					</thead>
					<tbody>
						${data.map(car => {
							return `
								<tr>
									<td>${car.id}</td>
									<td>${car.brand}</td>
									<td>${car.model}</td>
									<td>${car.pricePerDay}</td>
									<td>${car.bestDiscount}</td>
								</tr>
							`
						}).join('')}
					</tbody>
				</table>
			`
			allCarsDiv.innerHTML = carTable
	})
	.catch(err => console.error(err))
}

function getCarById(id) {
	return fetch('http://127.0.0.1:8080/api/cars/' + id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

function getCarDisplay(car) {
	return `
			<p>Id: ${car.id}</p>
			<p>Brand: ${car.brand}</p>
			<p>Model: ${car.model}</p>
			<p>Price per day: ${car.pricePerDay}</p>
			<p>Best discount: ${car.bestDiscount}</p>
	`
}

function displayCarById() {
	const id = document.getElementById('text-for-id').value

	const promise = getCarById(id)
	promise
	.then(response => {
		if (!response.ok) {
			return Promise.reject('error', response.status)
		}

		return response.json()
	})
	.then(car => {
		const carDisplay = getCarDisplay(car)

		carByIdDiv.innerHTML = carDisplay
	})
	.catch(err => console.error(err))
}

function addNewCar() {
	const brand = document.getElementById('input-brand').value
	const model = document.getElementById('input-model').value
	const pricePerDay = document.getElementById('input-price-per-day').value
	const bestDiscount = document.getElementById('input-best-discount').value

	fetch('http://127.0.0.1:8080/api/cars/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			brand: brand,
			model: model,
			pricePerDay: pricePerDay,
			bestDiscount: bestDiscount
		})
	})
	.then(response => {
		if (!response.ok) {
			return Promise.reject('error', response.status)
		}
		
		return response.json()
	})
	.then(car => {
		const carDisplay = getCarDisplay(car)

		newCarDiv.innerHTML = carDisplay
	})
	.catch(err => console.error(err))
}

function displayEditableCarById() {
	const id = document.getElementById('input-put-id').value
	const promise = getCarById(id)

	promise
	.then(response => {
		if (!response.ok) {
			return Promise.reject('error', response.status)
		}

		return response.json()
	})
	.then(car => {
		const carInputDisplay = `
			<div>
				<label for="input-put-brand">Car brand</label>"
				<input value="${car.brand}" id="input-put-brand">
			</div>
			<div>
				<label for="input-put-model">Car model</label>"
				<input value="${car.model}" id="input-put-model">
			</div>
			<div>
				<label for="input-put-price-per-day">Car price per day</label>"
				<input value="${car.pricePerDay}" id="input-put-price-per-day">
			</div>
			<div>
				<label for="input-put-brand">Car best discount</label>"
				<input value="${car.bestDiscount}" id="input-put-best-discount">
			</div>
			<button id="edit-car-button">Save</button>
		`

		editCarDiv.innerHTML = carInputDisplay

		const buttonEditCar = document.getElementById('edit-car-button')
		buttonEditCar.onclick = () => submitEditedCar(car.id)
	})

	function submitEditedCar(id) {
		const brand = document.getElementById('input-put-brand').value
		const model = document.getElementById('input-put-model').value
		const pricePerDay = document.getElementById('input-put-price-per-day').value
		const bestDiscount = document.getElementById('input-put-best-discount').value

		fetch('http://127.0.0.1:8080/api/cars/', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: id,
				brand: brand,
				model: model,
				pricePerDay: pricePerDay,
				bestDiscount: bestDiscount
			})
		})
	}
}