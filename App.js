import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from "react-native";

class ProductList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			products: [],
			isLoading: true
		};
	}

	componentDidMount() {
		this.syncData();
	}

	syncData = () => {
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

	render() {
		if(this.state.isLoading) {
			return (
				<View style={{flex: 1, paddingTop: 20}}>
					<ActivityIndicator animating size="large"/>
				</View>
			);
		}
		else {
			return (
				<View>
					<FlatList
						data={this.state.products}
						renderItem={({item}) => <Text>{item.id} {item.title}</Text>}
					/>
				</View>
			);
		}
	}
}

export default ProductList;
