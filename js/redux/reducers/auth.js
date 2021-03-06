const defaultState = {
	isLoggedIn: false,
	username: '',
	token: ''
};

export default function reducer(state = defaultState, action) {
	switch (action.type) {
		case 'LOGIN': 
			return Object.assign({}, state, { 
				isLoggedIn: true,
				username: action.username,
				token: action.token
			});
		case 'LOGOUT':
			return Object.assign({}, state, { 
				isLoggedIn: false,
				username: '',
				token: ''
			});
		default:
			return state;
	}
}
