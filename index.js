class FormFull {
	constructor (type) {
		this.type = type;
		this.types = {
			withEnrollment: {
				header: 'С зачислением',
				description: 'Полное среднее образование с 1 по 11 класс с выдачей аттестата государственного образца'
			},
			withoutEnrollment: {
				header: 'Без зачисления',
				description: 'Видеоуроки и сервисы по всем предметам'
			},
			full: {
				header: 'Расширенный',
				description: 'Обучение по тарифу “С зачислением”, плюс все дополнительные услуги'
			},
			presentive: {
				header: 'Предметный',
				description: 'Видеоуроки и сервисы по необходимому вам перечню предметов'
			}
		};
		this.teachingWays = {
			elementarySchool: {
				am: {
					withEnrollment: 4000,
					withoutEnrollment: 2000,
					sale: false
				},
				pm: {
					withEnrollment: 3000,
					withoutEnrollment: 1000,
					sale: this.type === 'full' || this.type === 'presentive' ? false : true
				}
			},
			highSchool: {
				am: {
					withEnrollment: 5000,
					withoutEnrollment: 4000,
					sale: false
				},
				pm: {
					withEnrollment: 4000,
					withoutEnrollment: 2000,
					sale: this.type === 'full' || this.type === 'presentive' ? false : true
				}
			}
		};
		this.defaultPrice = 8000;
		this.fullPrice = 25000;
		this.price = this.type === 'full' ? this.fullPrice : this.defaultPrice;
		this.priceForOne = this.type === 'full' ? this.fullPrice : this.defaultPrice;
		this.condition = {
			worktime: '1',
			class: '1-4',
			period: '1',
			childs: '1',
			disability: '0',
			presentive: '1'
		}
		this.servicesCondition = {
			privateTutor: 0,
			privatePsychologist: 0,
			accessToPreviousCourses: 0,
			privateLessons: 0,
			permanentSchedule: 0
		}
		this.initForm()
		this.initListeners()
	}

	initForm() {
		const body = document.querySelector('body')
		body.innerHTML = `
		<form class="card card-flex" id="formOne">
			<div class="card-left">
				${this.cardLeftHeader()}
				<div class="card-left__content">
					${this.cardLeftContentBlockOne()}
					${this.type === 'presentive' ? this.cardLeftContentBlockFour() : ''}
					${this.cardLeftContentBlockTwo()}
					${this.cardLeftContentBlockThree()}
				</div>
				<div class="card-left__footer card-content__flex">
				</div>
			</div>
			<div class="card-right">
				<div class="card-right__content">
					<div class="card-right__header">
						<div class="card-right__header_title">
							Дополнительные услуги:
						</div>
					</div>
					<div class="card-right__content_services">
						${this.cardRightContent()}
					</div>
				</div>
				${this.cardRightFooter()}
			</div>
		</form>
		` 
	}

	initListeners() {
		const worktime = document.querySelector('.card-left__content_time')
		const classes = document.querySelector('.card-left__content_classes')
		const period = document.querySelector('.card-left__content_period')
		const childs = document.querySelector('.card-left__content_child')
		const disability = document.querySelector('.card-left__content_disability')
		const presentive = document.querySelector('.card-left__content_presentives')
		const services = document.querySelectorAll('.card-right__service')

		services.forEach(item => {
			item?.addEventListener('click', (e) => {
				this.servicesCondition[e.target.name] = !this.servicesCondition[e.target.name]
				this.calcPrice()
			})
		})

		presentive?.addEventListener('click', (e) => {
			if (e.target.name === 'presentive' && e.target.checked) {
				this.condition[e.target.name] = e.target.value
				this.calcPrice()
			}
		})

		worktime?.addEventListener('click', (e) => {
			if (e.target.name === 'worktime' && e.target.checked) {
				this.condition[e.target.name] = e.target.value
				this.calcPrice()
			}
		})

		classes?.addEventListener('click', (e) => {
			if (e.target.name === 'class' && e.target.checked) {
				this.condition[e.target.name] = e.target.value
				this.calcPrice()
			}
		})

		period?.addEventListener('click', (e) => {
			if (e.target.name === 'period' && e.target.checked) {
				this.condition[e.target.name] = e.target.value
				this.calcPrice()
			}
		})

		childs?.addEventListener('click', (e) => {
			if (e.target.name === 'childs' && e.target.checked) {
				this.condition[e.target.name] = e.target.value
				this.calcPrice()
			}
		})

		disability?.addEventListener('click', (e) => {
			if (e.target.name === 'disability') {
				this.condition[e.target.name] = e.target.checked ? 1 : 0
				this.calcPrice()
			}
		})

		this.calcPrice()
	}

	calcPrice() {
		const {worktime, class: classes, period, childs, disability, presentive} = this.condition
		const {privateTutor, privatePsychologist, accessToPreviousCourses, privateLessons, permanentSchedule} = this.servicesCondition

		const privateTutorPrice = privateTutor ? this.service['privateTutor'].price : 0
		const privatePsychologistPrice = privatePsychologist ? this.service['privateTutor'].price : 0
		const accessToPreviousCoursesPrice = accessToPreviousCourses ? this.service['privateTutor'].price : 0
		const privateLessonsPrice = privateLessons ? this.service['privateTutor'].price : 0
		const permanentSchedulePrice = permanentSchedule ? this.service['privateTutor'].price : 0

		const workTimePrice = worktime === '1' ? 'am' : 'pm'
		const classPrice = classes === '1-4' ? 'elementarySchool' : 'highSchool'
		const periodPrice = parseInt(period)
		const childsPrice = parseInt(childs)
		const disabilityPrice = parseInt(disability)
		const presentivePrice = parseInt(presentive)

		const priceForService = privateTutorPrice + privatePsychologistPrice + accessToPreviousCoursesPrice + privateLessonsPrice + permanentSchedulePrice
		const price = this.teachingWays[classPrice][workTimePrice][this.type]

		const salePeriodPrice = periodPrice >= 4 ? periodPrice >= 7 ? 0.07 : 0.05 : 1
		const saleChildsPrice = childsPrice >= 2 ? childsPrice >= 3 ? 0.07 : 0.05 : 1
		const saleDisabilityPrice = disabilityPrice ? 0.1 : 1

		const haveSale = salePeriodPrice !== 1 || saleChildsPrice !== 1 || saleDisabilityPrice !== 1

		let initPrice = 0
		
		switch (this.type) {
			case 'full':
				initPrice = this.fullPrice
				break;
			case 'presentive':
				initPrice = 2000 * (presentivePrice + 1)
				break;
			default:
				initPrice = this.defaultPrice + price + priceForService
				break;
		}

		const sale = haveSale ? initPrice * periodPrice * childsPrice * saleChildsPrice * salePeriodPrice * saleDisabilityPrice : 0
		const saleForOne = haveSale ? initPrice * periodPrice * saleChildsPrice * salePeriodPrice * saleDisabilityPrice : 0

		this.price = initPrice * periodPrice * childsPrice - parseInt(sale)
		this.priceForOne = initPrice  - parseInt(saleForOne)
		this.cardLeftFooter()
	}

	cardLeftHeader() {
		const {header, description} = this.types[this.type]
		return `
		<div class="card-left__header">
			<div class="card-left__header_tariff">
					Тариф
			</div>
			<div class="card-left__header_title">
					${header}
			</div>
			<div class="card-left__header_subtitle">
					${description}
			</div>
		</div>
		`
	}

	cardLeftContentBlockOne() {
		return `
		<div class="card-left__content_block card-content__flex" style="justify-content: space-between;">
			<div class="card-left__content_worktime">
				<div class="card-left__content_title">Смена</div>
				<div class="card-left__content_time">
					<div class="card-button__radio">
						<input type="radio" name="worktime" id="timeOne" value="1" checked>
						<label for="timeOne">1 смена</label>
						<span class="card-button__radio_subtext">9:00 - 13:00 МСК</span>
					</div>
					<div class="card-button__radio">
						<input type="radio" name="worktime" id="timeTwo" value="2">
						<label for="timeTwo">2 смена</label>
						<span class="card-button__radio_subtext">14:00 - 18:00 МСК</span>
						<div class="card-button__radio_optiontext">
							<div class="card-button__radio_optiontext-timesale">%</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card-left__content_class">
				<div class="card-left__content_title">Класс</div>
				<div class="card-left__content_classes">
					<div class="card-button__radio">
						<input type="radio" name="class" id="classOne" value="1-4" checked>
						<label for="classOne">1-4</label>
					</div>
					<div class="card-button__radio">
						<input type="radio" name="class" id="classTwo" value="5-11">
						<label for="classTwo">5-11</label>
					</div>
				</div>
			</div>
		</div>
		`
	}

	cardLeftContentBlockTwo() {
		const btn = Array.from({ length: 9 }).map((i, index) => `
			<div class="card-button__radio">
				<input type="radio" name="period" id="period${index + 1}" value="${index + 1}" ${index + 1 === 1 ? 'checked' : ''}>
				<label for="period${index + 1}">${index + 1}</label>
			</div>
		`).join('')
		return `
		<div class="card-left__content_block">
			<div class="card-left__content_title">Период обучения(мес)</div>
			<div class="card-left__content_period">
				${btn}
			</div>
		</div>
		`
	}

	cardLeftContentBlockThree() {
		return `
		<div class="card-left__content_block card-content__flex">
			<div class="card-left__content_childs">
				<div class="card-left__content_title">Количество детей</div>
				<div class="card-left__main">
					<div class="card-left__content_child">
						<div class="card-button__radio">
							<input type="radio" name="childs" id="childOne" value="1" checked>
							<label for="childOne">1</label>
						</div>
						<div class="card-button__radio">
							<input type="radio" name="childs" id="childTwo" value="2">
							<label for="childTwo">2</label>
							<span class="card-button__radio_subtext">5% при оплате</span>
						</div>
						<div class="card-button__radio">
							<input type="radio" name="childs" id="childThree" value="3">
							<label for="childThree">3+</label>
							<span class="card-button__radio_subtext">7% при оплате</span>
						</div>
					</div>
					<div class="card-left__content_disability">
						<div class="card-checkbox">
							<input type="checkbox" name="disability" id="disability" hidden>
							<label for="disability" class="card-checkbox__btn"></label>
							<label for="disability" class="card-checkbox__title">Наличие инвалидности</label>
						</div>
						<div class="card-left__content_disability-description">
							При наличии документов, подтверждающих инвалидность, предоставляется скидка 10%
						</div>
					</div>
				</div>
			</div>
		</div>
		`
	}

	cardLeftContentBlockFour() {
		return `
		<div class="card-left__content_block card-content__flex">
			<div class="card-left__content_presentives">
				<div class="card-left__content_title">Количество предметов</div>
				<div class="card-left__main">
					<div class="card-left__content_presentive">
						<div class="card-button__radio">
							<input type="radio" name="presentive" id="presentiveOne" value="1" checked>
							<label for="presentiveOne">1</label>
						</div>
						<div class="card-button__radio">
							<input type="radio" name="presentive" id="presentiveTwo" value="2">
							<label for="presentiveTwo">2</label>
						</div>
						<div class="card-button__radio">
							<input type="radio" name="presentive" id="presentiveThree" value="3">
							<label for="presentiveThree">3</label>
						</div>
					</div>
					<div class="card-left__content_presentive-more">
						<div class="card-checkbox">
							<input type="radio" name="presentive" id="presentiveFour" value="4+" hidden>
							<label for="presentiveFour" class="card-checkbox__btn"></label>
							<label for="presentiveFour" class="card-checkbox__title">Больше</label>
						</div>
						<div class="card-left__content_presentive-description">
						Уточнить количество предметов с менеджером
						</div>
					</div>
				</div>
			</div>
		</div>
		`
	}

	cardLeftFooter() {
		const footer = document.querySelector('.card-left__footer')
		footer.innerHTML = `
			<div class="card-left__footer_priceall">
					<div class="card-left__footer_text">${this.price} <span class="card-left__footer_currency">₽</span></div>
					<div class="card-left__footer_subtext">Итоговая сумма</div>
			</div>
			<div class="card-left__footer_pricemonth">
				<div class="card-left__footer_text">${this.priceForOne} <span class="card-left__footer_currency">₽</span></div>
				<div class="card-left__footer_subtext">Цена за месяц обучения (1 ребенок)</div>
			</div>
		`
	}

	cardRightContent() {
		return Object.entries(this.service).map((item) => {
			const [key, detail] = item
			const {price, header, description} = detail
			return	`
				<div class="card-right__service">
					<div class="card-right__service_content">
						<div class="card-right__service_checkbox">
							<input 
								type="checkbox" 
								name="${key}" id="${key}" 
								value="${price}" 
								${this.type === 'full' ? 'checked' : ''} 
								${this.type === 'full' ? 'disabled' : ''}
								hidden>
							<label for="${key}"></label>
						</div>
						<div>
							<div class="card-right__service_content-title">${header}</div>
							<div class="card-right__service_content-text">${description || ''}</div>
						</div>
					</div>
					<div class="card-right__service_price">${price} ₽</div>
				</div>
			`
		}).join('')
	}

	cardRightFooter() {
		return `
		<div class="card-right__footer">
			<button class="card-right__submit" type="submit">Оставить заявку</button>
		</div>
		`
	}

	get service() {
		return {
			privateTutor: {
				price: 4000,
				header: 'Индивидуальный тьютор',
				description: 'Наставник, сопровождающий ученика в процессе обучения'
			},
			privatePsychologist: {
				price: 2000,
				header: 'Индивидуальный психолог',
				description: 'Дополнительные занятия с психологом'
			},
			accessToPreviousCourses: {
				price: 1000,
				header: 'Доступ к предыдущим курсам'
			},
			privateLessons: {
				price: 3000,
				header: 'Индивидуальные уроки (с требованием просмотров)',
				description: 'Все занятия индивидуальные, назначаются по факту просмотра ребенком видеоурока'
			},
			permanentSchedule: {
				price: 5000,
				header: 'Постоянное расписание (без требования просмотров)',
				description: 'Без требования просмотров видеоуроков'
			}
		}
	}
}

new FormFull('presentive')