import React, { Component } from "react";
import ProductListItem from "../components/ProductListItem";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Alert,
    View,
    Text
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as productActionCreators from "../actionCreators/product";
import { SearchBar } from 'react-native-elements'

let URI = "http://172.16.101.168:4000";

class SearchProductList extends Component {
    constructor(props) {
        super(props);
    }


    _renderItem = ({ index, item }) => {
        return (
            <ProductListItem
                {...this.props}
                id={item.id}
                title={`${item.id} - ${item.title}`}
                image={item.image ? `${URI}/images/${item.image}` : null}
                rating={item.rating}
                price={item.price}
                wish={item.wish || false}
                onWishTapped={this.onWishTapped}
            />
        );
    };

    _keyExtractor = (item, index) => {
        return `${index}`;
    };

    _onRefresh = () => {
        //this.setState({ isRefreshing: true });
        this._getProducts();
    };

    _renderRefreshControl() {
        return (
            <RefreshControl
                onRefresh={this._onRefresh}
                refreshing={this.props.isRefreshing}
                tintColor={"#00ff80"}
                title={"Refreshing..."}
                titleColor={"#00ff80"}
            />
        );
    }

    /*  flat list supporting methods - END */
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <SearchBar
                    onChangeText={(text) => this.props.actions.searchProduct(text, page = 1, limit = 20)}
                    onClearText={()=>{}}
                    placeholder='Search...' />
                {this.props.isLoading ? (
                    <ActivityIndicator size="large" color="#00ff80" />
                ) : (
                        this.props.searchProductList && this.props.searchProductList.length>0 ?

                        <FlatList
                            data={this.props.searchProductList}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                            onEndReachedThreshold={0.5}
                        /> : <Text> No Content</Text>
                    )} 
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.productState.isLoading,
        isRefreshing: state.productState.isRefreshing,
        page: state.productState.page,
        limit: state.productState.limit,
        searchProductList: state.productState.searchProductList
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(productActionCreators, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(
    SearchProductList
);
