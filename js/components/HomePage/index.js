import React, { Component } from 'react';

import {
	View, ActivityIndicator
} from 'react-native';

import {
	Container,
	Content, Body,
	List, ListItem,
	Thumbnail,
	Text,
	Button
} from 'native-base';


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
			<Button transparent onPress={() => navigation.navigate('AuthPage')}>
				<Text>Sign in</Text>
			</Button>
	});

	componentDidMount() {
		this.syncProducts();
	}

	//syncProducts() {{{
	syncProducts = () => {
		this.setState({ isLoading: true });

		fetch('http://smktesting.herokuapp.com/api/products/')
		.then((response) => response.json())
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
	//renderSeparator() {{{
	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					backgroundColor: "#CED0CE",
				}}
			/>
		);
	}
	//}}}
	//renderFooter() {{{
	renderFooter = () => {
		if (!this.state.isLoading) return null;

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
	//}}}

	//render() {{{
	render() {
		const {navigate} = this.props.navigation;

		if(this.state.isLoading) {
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
		else {
			return (
				<Container style={{backgroundColor: 'white'}}>
					<Content>
						<List
							dataArray={this.state.products}
							renderRow={(item) =>
								<ListItem onPress={() => navigate('ProductPage', { product: item })}>
									<Thumbnail square size={160} source={{ uri: 'http://smktesting.herokuapp.com/static/'+item.img }} />
									<Body>
										<Text>{item.title}</Text>
										<Text note>{item.text}</Text>
									</Body>
								</ListItem>
							}
						>
						</List>
					</Content>
				</Container>
			);
		}
	}
	//}}}
}

export default HomePage;
