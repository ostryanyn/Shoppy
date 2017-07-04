import { BASE_URL } from '../config/api';

export const request = (url, method, data) => {
	let body = null;
	if (method !== 'GET') {
		body = JSON.stringify(data);
	}

	return new Promise((resolve, reject) => {
		fetch(
			`${BASE_URL}${url}`,
			{
				method,
				headers: { 'Content-Type': 'application/json' },
				body
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			resolve(responseJson);
		})
		.catch((error) => {
			reject(error);
		});
	});
}

