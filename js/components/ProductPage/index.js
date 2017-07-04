import React, { Component } from 'react';

import { View, Image, ActivityIndicator } from 'react-native';

import {
	Container, Content,
	Card, CardItem, Thumbnail,
	Form, Input, Item,
	Left, Body, Toast,
	Text, Button,
	List, ListItem, Icon
} from 'native-base';

import { Rating, TextInput } from 'react-native-elements';

import { connect } from 'react-redux';

import moment from 'moment';

class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {},
			reviews: [],

			//user review
			userRate: 3,
			userText: '',

			serverError: '',
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

	//syncReviews() {{{
	syncReviews = () => {
		this.setState({ isLoading: true });

		fetch('http://smktesting.herokuapp.com/api/reviews/' + this.state.product.id)
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				reviews:
					//newest first
					responseJson.sort((a,b) => {
						a_date = moment(a.created_at);
						b_date = moment(b.created_at);
						if(a_date.isBefore(b_date)) return 1;
						else return -1;
					}),
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
				headers: {'Authorization': 'Token ' + this.props.token,
				          'Content-Type': 'application/json' },
				body: JSON.stringify({ rate: this.state.userRate, text: this.state.userText })
			}
		)
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.success == true) {
				this.setState({
					userText: '', userRate: 3
				});
				Toast.show({
					text: 'Your review has beed posted!',
					position: 'bottom',
					buttonText: 'Okay'
				});
				this.syncReviews();
			}
			else {
				this.setState({
					serverError: responseJson.message
				});
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
							<Text note>June 30, 2013</Text>
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
						<Icon name="chatbubbles" />
						<Text>{this.state.isLoading ? '...' : this.state.reviews.length}</Text>
					</Left>
				</CardItem>
			</Card>
		);
	}
	//}}}
	//renderSubmitReviewForm() {{{
	renderSubmitReviewForm = () => {
		const isLoggedIn = this.props.isLoggedIn;

		if(isLoggedIn)
			return (
				<Form style={{padding: 24, backgroundColor: 'white'}}>
					{this.state.serverError !== '' && <Text style={{color: 'tomato'}}>{this.state.serverError}</Text>}
					<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<Rating
							imageSize={30}
							fractions={0}
							onFinishRating={this.ratingCompleted}
							style={{ paddingVertical: 10 }} />
						<Text style={{color: 'slategray'}}>{'\t'}{this.state.userRate}/5</Text>
					</View>
					<Item regular>
						<Input
							value={this.state.userText}
							onChangeText={(text) => this.setState({userText: text})}
							placeholder='Write what you think about this product...' />
					</Item>
					<Button onPress={this.submitReview} style={{marginTop: 12}}>
						<Text>Submit</Text>
					</Button>
				</Form>
			);
		else
			return (
				<View style={{padding: 24}}>
					<Text
						style={{color: 'steelblue'}}
						onPress={() => this.props.navigation.navigate('AuthPage')}
					>
						Login/register{' '}
					</Text>
					<Text>
						in order to leave a review.
					</Text>
				</View>
			);
	}
	//}}}
	//renderProductReviews() {{{
	renderProductReviews = () => {
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
	//}}}

	ratingCompleted = rating => {
		this.setState({userRate: rating});
	}

	//render() {{{
	render() {
		const isLoading = this.state.isLoading;

		return (
			<Container>
				<Content>
				{this.renderProductInfo()}
				{isLoading ?
					(
						<View
							style={{
								paddingVertical: 20,
								borderTopWidth: 1,
								borderColor: "#CED0CE"
							}}
						>
							<ActivityIndicator animating size="large" />
						</View>
					) : (
						<View>
							{this.renderSubmitReviewForm()}
							{this.renderProductReviews()}
						</View>
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
		username: state.auth.username,
		token: state.auth.token
	};
}

export default connect(mapStateToProps)(ProductPage);
