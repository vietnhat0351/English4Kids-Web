import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'

export class EmptyLayout extends Component {
  static propTypes = {

  }

  render() {
    return (
      <div>
        <Outlet />
      </div>
    )
  }
}

export default EmptyLayout
