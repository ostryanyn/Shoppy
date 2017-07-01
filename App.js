import React, { Component } from 'react';
import { View, Text, Image, Button, FlatList, ActivityIndicator } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';

class ProductsScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			isLoading: true
		};
	}
	static navigationOptions = {
		title: 'Products',
	}

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

	//render() {{{
	render() {
		return (
			<View>
			<List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
				<FlatList
					data={this.state.products}
					renderItem={({ item }) => (
						<ListItem
							largeAvatar
							title={item.title}
							subtitle={item.text}
							avatar={{ uri: 'http://smktesting.herokuapp.com/static/'+item.img }}
							containerStyle={{ borderBottomWidth: 0 }}
							onPress={() => this.props.navigation.navigate('ProductPage', { product: item })}
						/>
					)}
					keyExtractor={item => item.id}
					onEndReachedThreshold={50}
				/>
			</List>
			</View>
		);
	}
	//}}}
}

class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {},
			reviews: [],
			isLoading: true
		};
	}
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.product.title,
	});

	componentWillMount() {
		this.setState({product: this.props.navigation.state.params.product});
	}
	componentDidMount() {
		this.syncReviews();
	}

	//syncReviews() {{{
	syncReviews = () => {
		this.setState({ isLoading: true });

		fetch('http://smktesting.herokuapp.com/api/reviews/' + this.state.product.id)
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				reviews: responseJson,
				isLoading: false,
			});
			//}, function() { });
		})
		.catch((error) => {
			console.error(error);
		});
	};
	//}}}

	//render() {{{
	render() {
		return (
			<View style={{flex:1, padding: 16}}>
				<Image
					source={{ uri: 'http://smktesting.herokuapp.com/static/' + this.state.product.img }}
					style={{width: 100, height: 100}}
				/>
				<List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
					<FlatList
						data={this.state.reviews}
						renderItem={({ item }) => (
							<ListItem
								title={item.text}
								subtitle={item.created_by.username}
								containerStyle={{ borderBottomWidth: 0 }}
								hideChevron
							/>
						)}
						onEndReachedThreshold={50}
					/>
				</List>
			</View>
		);
	}
	//}}}
}

const ModalStack = StackNavigator({
  Home: {
    screen: ProductsScreen,
  },
  ProductPage: {
    path: 'people/:name',
    screen: ProductPage,
  },
});

export default ModalStack;
