export class OperationResult {
	ok = false;
	message = "";

	succeeded(message = "OK"){
		this.ok = true;
		this.message = message;
		return this;
	}

	failed(message = "Failed"){
		this.ok = false;
		this.message = message;
		return this;
	}
};
