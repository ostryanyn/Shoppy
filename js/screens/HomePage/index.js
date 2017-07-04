import React, { Component } from 'react';

import { connect } from 'react-redux';

import {
	View, ActivityIndicator
} from 'react-native';

import {
	Container, Content,
	Left, Body, Right,
	List, ListItem,
	Thumbnail,
	Text,
	Button
} from 'native-base';

import { request } from '../../utils/api.js';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			isLoading: false
		};
	}
	static navigationOptions = ({ navigation }) => ({
		title: 'Home',
		headerRight:
			<Button transparent danger onPress={() => navigation.navigate('AuthPage')}>
				<Text>Profile</Text>
			</Button>
	});

	componentDidMount() {
		this.syncProducts();
	}

	//syncProducts() {{{
	syncProducts = () => {
		this.setState({ isLoading: true });

		request('/products', 'GET')
		.then((responseJson) => {
			this.setState({
				products: responseJson,
				isLoading: false,
			});
			//}, function() { });
		})
		.catch((error) => {
			console.error(error);
		});
	};
	//}}}

	//handleRefresh() {{{
	handleRefresh = () => {
		this.syncProducts();
	}
	//}}}

	//render() {{{
	render() {
		const {navigate} = this.props.navigation;
		const isLoading = this.state.isLoading;
		const products = this.state.products

		if(isLoading) {
			return (
				<View
					style={{
						paddingVertical: 20,
						borderTopWidth: 1,
						borderColor: "#CED0CE"
					}}
				>
					<ActivityIndicator animating size="large" />
				</View>
			);
		}
		return (
			<Container style={{backgroundColor: 'white'}}>
				<Content>
					<List
						dataArray={products}
						renderRow={(item) =>
							<ListItem thumbnail onPress={() => navigate('ProductPage', { product: item })}>
								<Left>
									<Thumbnail square size={128} source={{ uri: 'http://smktesting.herokuapp.com/static/'+item.img }} />
								</Left>
								<Body>
									<Text>{item.title}</Text>
									<Text note>{item.text}</Text>
								</Body>
								<Right>
									<Text style={{color: 'steelblue'}}>View</Text>
								</Right>
							</ListItem>
						}
					>
					</List>
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

export default HomePage;
