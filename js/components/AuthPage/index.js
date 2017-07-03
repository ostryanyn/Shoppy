import React, { Component } from 'react';

import { View, KeyboardAvoidingView } from 'react-native';

import {
	Container, Text,
	Content,
	Form, Label, Input,
	Item,
	Button
} from 'native-base';

class AuthPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			userpassword: '',
			isLoggedIn: false,
			serverError: ''
		};
	}
	static navigationOptions = ({ navigation }) => ({
		title: 'Authorization',
	});

	componentWillMount() {
		if(authenticationToken !== null)
			this.setState({isLoggedIn: true});
		else
			this.setState({isLoggedIn: false});
	}

	//auth() {{{
	auth = mode => {
		this.setState({isLoggingIn: true});
		fetch(
			'http://smktesting.herokuapp.com/api/'+mode+'/',
			{
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ username: this.state.username, password: this.state.userpassword })
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.success == true) {
				authenticationToken = responseJson.token;
				user = this.state.username;
				this.setState({
					isLoggedIn: true
				});
			}
			else {
				this.setState({serverError: responseJson.message});
			}
			//}, function() { });
		})
		.catch((error) => {
			console.error(error);
		});
	}
	//}}}

	//render() {{{
	render() {
		const isLoggedIn = this.state.isLoggedIn;
		const serverError = this.state.serverError;

		return (
			<Container>
				<Content style={{padding: 32}}>
					{isLoggedIn ?
						(
							<View>
								<Text>Signed in as {user}</Text>
								<Button style={{marginTop: 16}} block warning onPress={() => this.auth('register')}>
									<Text>Sign out</Text>
								</Button>
							</View>
						) : (
							<Form>
								{serverError !== '' && <Text>{serverError}</Text>}
								<Item floatingLabel last>
									<Label>Username</Label>
									<Input
										value={this.state.username}
										onChangeText={(text) => this.setState({username: text})} />
								</Item>
								<Item floatingLabel last>
									<Label>Password</Label>
									<Input
										value={this.state.userpassword}
										onChangeText={(text) => this.setState({userpassword: text})} />
								</Item>
								<Button style={{marginTop: 16}} block success onPress={() => this.auth('login')}>
									<Text>Sign in</Text>
								</Button>
								<Button style={{marginTop: 16}} block onPress={() => this.auth('register')}>
									<Text>Register</Text>
								</Button>
							</Form>
						)
					}
				</Content>
			</Container>
		);
	}
	//}}}
}

export default AuthPage
