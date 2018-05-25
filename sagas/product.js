import {
    put,
    takeLatest
} from "redux-saga/effects";
import * as actionCreators from "../actionCreators/product"
import {
    GET_PRODUCTS, ADD_PRODUCT, DELETE_PRODUCT, SEARCH_PRODUCT, GET_PRODUCT
} from "../actionTypes/product";

import {Alert, Vibration} from 'react-native';

let URI = "http://172.16.101.168:4000";

function* getProducts(action) {
    try {
        let url = `${URI}/products?_page=${action.page}&_limit=${action.limit}`;
        console.log(url);
        let products = yield fetch(url).then(r => r.json());
        yield put(actionCreators.getProductsSuccess(products))
    } catch (error) {
        yield put(actionCreators.getProductsFailure(error))
    }
}

function* deleteProduct(action) {
    try {
        let product = yield fetch(`${URI}/products/${action.id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
        }).then(r => r.json());
        yield put(actionCreators.deleteProductSuccess(action.id))
        yield vibrate()
    } catch (error) {
        yield put(actionCreators.deleteProductFailure(error))
    }
}

 function* searchProducts(action){
     try {
         let url = `${URI}/products?title_like=${action.search}&_page=${action.page}&_limit=${action.limit}`;
         console.log(url);
         let products = yield fetch(url).then(r => r.json());
         yield put(actionCreators.searchProductSuccess(products))
     } catch (error) {
         yield put(actionCreators.searchProductFailure(error))
     }
    
 }

function alert(){
    Alert.alert("Success", "Save successfully!!!");
}

function vibrate(){
    Vibration.vibrate(1000);
}

function* getProduct(action) {
    try {
        let product = yield fetch(`${URI}/products/${action.id}`).then(r => r.json());
        yield put(actionCreators.getProductSuccess(product))
    } catch (error) {
        yield put(actionCreators.getProductFailure(error))
    }
}

function* addProduct(action) {
    try {
        let product = yield fetch(`${URI}/products`, {
            body: JSON.stringify(action.product),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
        }).then(r => r.json());
        yield put(actionCreators.addProductSuccess(product))
        yield alert();
    } catch (error) {
        yield put(actionCreators.addProductFailure(error))
    }
}

export function* productWatchers() {
    yield takeLatest(GET_PRODUCTS, getProducts)
    yield takeLatest(DELETE_PRODUCT, deleteProduct)
    yield takeLatest(SEARCH_PRODUCT, searchProducts)
    yield takeLatest(GET_PRODUCT, getProduct)
    yield takeLatest(ADD_PRODUCT, addProduct)
}