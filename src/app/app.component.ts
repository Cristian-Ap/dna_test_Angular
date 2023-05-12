import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	public dnaChain = '';
	public errorFound = false;
	public errorMessage = '';
	public validaLetters = /^[ATCG]+$/;
	public tableMutations: string[][] = [];
	public showResults = false;
	public resultMessage = '';

	public isMutant(){
		// validate data
		if (this.dnaChain === '' || this.dnaChain.length === 0) {
			this.setError('value is required');
			return;
		}
		
		// clean data
		const value = this.dnaChain.replaceAll('"','').replace('{','').replace('}','').split(',');

		// validate lenght of data
		if (value.length < 6) {
			this.setError('wrong chain length');
			this.dnaChain = '';
			return;
		}

		let insideError = false;
		let matrix = [];

		// validate inside data length and crate bidireccional array
		for (const item of value) {
			if (item.length < 6) {
				insideError = true;
				break;
			}
			if (!item.match(this.validaLetters)) {
				insideError = true;
				break;
			}
			matrix.push(item.split(''));
		}

		if (insideError) {
			this.setError('wrong chain structure');
			this.dnaChain = '';
			return;
		}

		const isMutant = this.validateData(matrix);

		this.showResults = true;
		this.resultMessage = 'You are not a mutant';
		this.tableMutations = matrix;

		if (isMutant) {
			this.resultMessage = 'You are a mutant'
		}
		this.errorFound = false;

	}

	public validateData(data: string[][]): boolean {
		let isMutant = false;
		let cont = 0;
		// validate horizontal value
		data.forEach(el => {
			cont = 0;
			let reducer = el.reduce((a, b) => {
				if (a === b) {
					cont++;
					return a;
				}
				return b;
			})
			if (cont >= 3) isMutant = true;
		})

		// validate vertical value
		for (let i = 0; i < data.length; i++ ) {
			cont = 0;
			for (let j = 0; j < data.length - 1; j++) {
				if (data[j][i] === data[j+1][i]){
					cont++
				}	
			}
			if (cont >= 4) isMutant = true;
		}	

		// validate vertical value
		for (let y = 0; y < 3; y++) {
			cont = 0;
			let curra = '';
			let currb = ''
			for (let i = 0, j = y; i < data.length; i++, j++) {
				if (curra === data[i][j]) {
					cont++
				}
				curra = data[i][j];
			}
			if (cont >= 3) isMutant = true;
			cont = 0;
			for (let i = y+1, j = 0; i < data.length; i++, j++) {
				if( currb === data[i][j]){
					cont++
				}
				currb = data[i][j];
			}
			if (cont >= 3) isMutant = true;
		}
		
		for(let y = 3; y < 8; y++){
			cont = 0;
			let currc = ''
			for (let i = 0, j = y; i < data.length; i++, j--) {
				if(currc && currc === data[i][j]) cont++;
				currc = data[i][j];
				if (cont >= 3) isMutant = true;
			}
		}

		return isMutant;
	}

	public clean(){
		this.dnaChain = '';
	}

	public setError(message: string){
		this.errorFound = true;
		this.errorMessage = message
		this.tableMutations = [];
		this.showResults = false;
	}
}
