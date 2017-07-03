import React, { Component } from 'react';

import { StackNavigator } from 'react-navigation';

import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';

authenticationToken = null;
user = '';

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
