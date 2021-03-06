import React, { Component, PropTypes } from 'react'
import { inject } from 'mobx-react'
import {
  registerSidePanelView
} from './actions'
import PanelState from './state'

@inject((__, { side }) => {
  let { activeViewId } = PanelState.sidePanelViews[side]
  if (!activeViewId) activeViewId = ''
  return { activeViewId }
})
class SidePanelContainer extends Component {
  constructor (props) {
    super(props)
    const children = this.getChildren()
    const { side } = this.props

    registerSidePanelView({
      side,
      labels: children.map((sidePanelView, idx) => ({
        ...sidePanelView.props.label,
        viewId: `${side}_${idx}`,
      })),
      activeViewId: `${side}_${children.reduce((activeViewIndex, sidePanelView, idx) => {
        if (sidePanelView.props.active) activeViewIndex = idx
        return activeViewIndex
      }, 0)}`
    })
  }

  getChildren () {
    if (!this.props.children) return []
    return Array.isArray(this.props.children) ? this.props.children : [this.props.children]
  }

  render () {
    const children = this.getChildren()
    const activeViewIndex = Number(this.props.activeViewId.split('_')[1])
    return (<div style={{ height: '100%' }}>
      {children.map((child, idx) =>
        <SidePanelViewContent key={idx}
          view={child}
          isActive={activeViewIndex ? activeViewIndex === idx : idx === 0}
        />
      )}
    </div>)
  }
}

const SidePanelViewContent = ({ isActive, view }) => <div style={{ height: '100%', display: isActive ? 'block' : 'none' }}>{view}</div>

class SidePanelView extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return this.props.children
  }
}


export { SidePanelContainer, SidePanelView }
