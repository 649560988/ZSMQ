import React from 'react'
import {
  TextInput,
  Alert,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import * as Icons from '../icons'

export class HeaderSearch extends React.Component {
  state = {
    text: ''
  }

  componentDidMount () {
    this.setState({
      text: this.props.defaultValue
    })
  }

  handlePressClearText = () => {
    this.handleChangeText('')
  }

  handleChangeText = (text) => {
    this.setState({ text }, () => {
      this.props.onChangeText(text)
    })
  }

  handleKeyPress = (e) => {
    const { key } = e.nativeEvent
    if (key === 'Enter') {
      this.props.onEnterKeyPress(this.state)
    }
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state)
  }

  render () {
    return (
      <View style={this.props.style}>
        <TextInput
          // ref={this.searchInput}
          onSubmitEditing={this.handleSubmit}
          autoFocus
          onChangeText={this.handleChangeText}
          placeholder={this.props.placeholder}
          value={this.state.text}
          style={{
            backgroundColor: '#FFF',
            borderRadius: 10
          }}
        />
        {
          this.state.text === '' ? null
            : <TouchableOpacity
              onPress={this.handlePressClearText}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                right: 0,
                position: 'absolute'
              }}
            >
              <Icons.CloseSearch size={20}></Icons.CloseSearch>
            </TouchableOpacity>
        }

      </View>
    )
  }
}
