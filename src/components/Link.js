import React from 'react'

import {
  TouchableOpacity,
  Text
} from 'react-native'

import {
  withNavigation
} from 'react-navigation'

export const Link = withNavigation(class extends React.Component {
  static defaultProps = {
    disabled: false
  }
  onPress = () => {
    if (this.props.disabled) return false
    this.props.navigation.navigate(this.props.to)
  }

  render () {
    const { children, ...extraProps } = this.props
    return (
      <TouchableOpacity onPress={this.onPress} {...extraProps}>
        {
          typeof children === 'string'
            ? <Text style={this.props.style}>{children}</Text>
            : children
        }
      </TouchableOpacity>
    )
  }
})
