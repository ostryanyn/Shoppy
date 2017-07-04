import Expo from 'expo';
import React, { Component } from 'react';

import { Root } from 'native-base';

import { Provider } from 'react-redux';

import App from './js/App';
import store from './js/redux';

export default class Shoppy extends Component {
	constructor() {
		super();
		this.state = {
			isReady: false
		};
	}

	async componentWillMount() {
		await Expo.Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
		});

		this.setState({ isReady: true });
	}
	render() {
		if (!this.state.isReady) {
			return <Expo.AppLoading />;
		}
		return (
			<Provider store={store}>
				<Root>
					<App />
				</Root>
			</Provider>
		);
	}
}
