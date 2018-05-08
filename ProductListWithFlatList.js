import React, { Component } from "react";
import ProductListItem from "./ProductListItem";
import {
  ActivityIndicator,
  ScrollView,
  FlatList,
  RefreshControl
} from "react-native";

let URI = "http://192.168.1.101:4000";

class ProductListWithFlatList extends Component {
  constructor(props) {
    super(props);
    this.state = { products: [], isLoading: false, isRefreshing: false };
    this.page = 1;
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this._getProducts();
  }

  _getProducts = (page = 1, limit = 8) => {
    fetch(`${URI}/products?_page${page}&_limit=${limit}`)
      .then(r => r.json())
      .then(products => {
        
        let newProducts = [].concat(this.state.products);
        newProducts = [...products, ...newProducts];
       
        this.setState({
          products: newProducts,
          isLoading: false,
          isRefreshing: false
        });
      });
  };

  /*  flat list supporting methods */

  _getMore = () => {
    this._getProducts(++this.page);
  };

  _renderItem = ({ index, item }) => {
    return (
      <ProductListItem
        {...this.props}
        key={item.id}
        id={item.id}
        title={`${index + 1} - ${item.title}`}
        image={`${URI}/images/${item.image}`}
        rating={item.rating}
        price={item.price}
      />
    );
  }

  _keyExtractor = (item, index) => `${item.id}`;

  _onRefresh = () => {
    this.setState({ isRefreshing: true });
    this._getProducts();
  };

  _renderRefreshControl() {
    return (
      <RefreshControl
        onRefresh={this._onRefresh}
        refreshing={this.state.isRefreshing}
        tintColor={"#00ff80"}
        title={"Refreshing..."}
        titleColor={"#00ff80"}
      />
    );
  }

  /*  flat list supporting methods - END */

  render() {
    return this.state.isLoading ? (
      <ActivityIndicator size="large" color="#00ff80" />
    ) : (
      <FlatList
        
        data={this.state.products}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this._getMore}
        refreshControl={this._renderRefreshControl()}
      />
    );
  }
}

export default ProductListWithFlatList;