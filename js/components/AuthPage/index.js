import React, { Component } from 'react';

import { View, KeyboardAvoidingView } from 'react-native';

import {
	Container, Text,
	Content,
	Form, Label, Input,
	Item,
	Button
} from 'native-base';

import { connect } from 'react-redux';

import { login, logout } from '../../redux/actions/auth';

class AuthPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			serverError: ''
		};
	}
	static navigationOptions = ({ navigation }) => ({
		title: 'Authorization',
	});

	//auth() {{{
	auth = mode => {
		this.setState({serverError: ''});

		fetch(
			'http://smktesting.herokuapp.com/api/'+mode+'/',
			{
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ username: this.state.username, password: this.state.password })
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.success == true) {
				this.props.onLogin(this.state.username, responseJson.token);
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
	//deauth() {{{
	deauth = () => {
		this.props.onLogout();
	}
	//}}}

	//render() {{{
	render() {
		const serverError = this.state.serverError;
		const { isLoggedIn, username } = this.props;

		return (
			<Container>
				<Content style={{padding: 32}}>
					{isLoggedIn ?
						(
							<View>
								<Text>Signed in as {username}</Text>
								<Button style={{marginTop: 16}} block warning onPress={() => this.deauth()}>
									<Text>Sign out</Text>
								</Button>
							</View>
						) : (
							<Form>
								{serverError !== '' && <Text style={{color: 'tomato'}}>{serverError}</Text>}
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

const mapStateToProps = (state, ownProps) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		username: state.auth.username
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLogin: (username, token) => { dispatch(login(username, token)); },
		onLogout: () => { dispatch(logout()); }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
