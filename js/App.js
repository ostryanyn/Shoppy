import React, { Component } from 'react';

import { StackNavigator } from 'react-navigation';
import HomePage from './screens/HomePage';
import AuthPage from './screens/AuthPage';
import ProductPage from './screens/ProductPage';

const ModalStack = StackNavigator(
	{
		Home: { screen: HomePage },
		ProductPage: { screen: ProductPage },
		AuthPage: { screen: AuthPage },
	},
	{
		initialRouteName: "Home",
	}
);

export default ModalStack;
