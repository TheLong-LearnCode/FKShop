import React, { Component } from 'react'

import { Products } from '../ListOfProduct.jsx'
import CardContent from './CardContent'
export default class CardMainContent extends Component {
  constructor() {
    super()
    this.state = {
      products: Products
    }
  }
  render() {
    return (
      <CardContent productData={this.state.products} />
    )
  }
}
