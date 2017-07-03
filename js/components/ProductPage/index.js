import React, { Component } from 'react';

import { View, Image, ActivityIndicator } from 'react-native';

import {
	Container, Content,
	Card, CardItem, Thumbnail,
	Left, Body,
	Text, Button,
	List, ListItem, Icon
} from 'native-base';

import { Rating, TextInput } from 'react-native-elements';

import moment from 'moment';

class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {},
			reviews: [],

			//user review
			//userHasReview: false,
			userRate: 0,
			userText: '',

			isLoading: false,
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
	/*async componentWillMount() {
		await Expo.Font.loadAsync({
			'Roboto': require('native-base/Fonts/Roboto.ttf'),
			'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
		});
	}*/

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
	//submitReview() {{{
	submitReview = () => {
		fetch(
			'http://smktesting.herokuapp.com/api/reviews/' + this.state.product.id,
			{
				method: 'POST',
				headers: {'Authorization': 'Token ' + authenticationToken,
				          'Content-Type': 'application/json' },
				body: JSON.stringify({ rate: this.state.userRate, text: this.state.userText })
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.success == true) {
				this.setState({
					userHasReview: true
				});
			}
			else {
				alert('fail posting review '+this.state.userText+' '+this.state.userRate);
			}
			//}, function() { });
		})
		.catch((error) => {
			console.error(error);
		});
	}
	//}}}

	//renderProductInfo() {{{
	renderProductInfo = () => {
		return (
			<Card style={{flex: 0}}>
				<CardItem>
					<Left>
						<Thumbnail source={{ uri: 'http://smktesting.herokuapp.com/static/' + this.state.product.img }} />
						<Body>
							<Text>{this.state.product.title}</Text>
							<Text note>April 15, 2016</Text>
						</Body>
					</Left>
				</CardItem>
				<CardItem>
					<Body>
						<Image source={{ uri: 'http://smktesting.herokuapp.com/static/' + this.state.product.img }} style={{height: 200, width: 200, flex: 1}}/>
						<Text>{this.state.product.text}</Text>
					</Body>
				</CardItem>
				<CardItem>
					<Left>
						<Button transparent textStyle={{color: '#87838B'}}>
							<Icon name="chatbubbles" />
							<Text>8</Text>
						</Button>
					</Left>
				</CardItem>
			</Card>
		);
	}
	//}}}
	//renderSubmitReviewForm() {{{
	renderSubmitReviewForm = () => {
		if(authenticationToken == null)
			return (
				<Text style={{padding: 10}}>
					<Text
						style={{color: 'steelblue'}}
						onPress={() => this.props.navigation.navigate('AuthPage')}
					>
						Login/register{' '}
					</Text>
					<Text>
						in order to leave a review
					</Text>
				</Text>
			);
		else
			return (
				<View>
					<Rating
						showRating
						onFinishRating={this.ratingCompleted}
						style={{ paddingVertical: 10 }}
					/>
					<TextInput
						placeholder='Write what you think about this product...'
						value={this.state.userText}
						onChangeText={(text) => this.setState({userText: text})}
					/>
					/*<Button
						title='Submit'
						onPress={this.submitReview}
					/>*/
				</View>
			);
	}
	//}}}
	//renderProductReviews() {{{
	renderProductReviews = () => {
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
				<List dataArray={this.state.reviews}
					style={{backgroundColor: 'white'}}
					renderRow={(item) =>
						<ListItem>
							<Body>
								<Rating imageSize={20} readonly startingValue={item.rate} style={{padding: 10}} />
								<Text>{item.text}</Text>
								<Text style={{color: '#777'}}>
									{`${item.created_by.username} commented ${moment(item.created_at).fromNow()}`}
								</Text>
							</Body>
						</ListItem>
					}
				>
				</List>
			);
		}
	}
	//}}}

	ratingCompleted = rating => {
		this.setState({userRate: rating});
	}

	//render() {{{
	render() {
		return (
			<Container>
				<Content>
				{this.renderProductInfo()}
				{this.renderSubmitReviewForm()}
				{this.renderProductReviews()}
				</Content>
			</Container>
		);
	}
	//}}}
}

export default ProductPage;
