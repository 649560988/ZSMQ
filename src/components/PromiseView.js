import React from 'react'
import EventEmitter from 'events'

export const promiseToEvent = (promise) => {
  const emitter = new EventEmitter()

  promise.then(res => {
    emitter.emit('change', 'resolved', res)
  }).catch(err => {
    emitter.emit('change', 'rejected', err)
  })

  return emitter
}

class PromiseView extends React.Component {
  static defaultProps = {
    onStateChange: () => {}
  }

  state = {}

  componentDidMount = () => {
    this.initListener(this.props)
  }

  componentDidUpdate = (prevProps) => {
    if (!(this.props.promise === prevProps.promise)) {
      this.initListener(this.props)
    }
  }

  initListener = (props) => {
    if (this.listener) this.listener.removeAllListeners()
    if (!(props.promise instanceof Promise)) {
      this.setState({ status: 'none' })
      props.onStateChange('none')
      this.listener = null
    } else {
      this.setState({ status: 'pending' })
      props.onStateChange('pending')
      this.listener = promiseToEvent(props.promise)
      this.listener.on('change', (status, result) => {
        props.onStateChange(status, result)
        this.setState({ status, result })
      })
    }
  }

  componentWillUnmount = () => {
    if (this.listener) this.listener.removeAllListeners()
  }

  render () {
    const { render, children = null } = this.props
    if (typeof render === 'function') return render(this.state.status, this.state.result) || null
    if (typeof children === 'function') return children(this.state.status, this.state.result) || null
    return children
  }
}

export default PromiseView
