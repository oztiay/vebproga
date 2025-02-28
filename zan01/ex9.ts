class Controller {
	public check(eggs: IEgg[]): boolean {
		const isValid: boolean = Validator.valid(eggs);
		return isValid;
	}
}

// ничего не выведет, в коде не определены функция Validator.valid и тип IEgg[]