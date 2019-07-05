import React from 'react'
import codePush from 'react-native-code-push'
import { SessionProvider } from './src/Session'
import { ThemeProvider } from './src/Theme'
import { MainScreen } from './src/Main'

class App extends React.Component {
  componentDidMount () {
    codePush.notifyAppReady()
  }

  render () {
    return (
      <SessionProvider>
        <ThemeProvider>
          <MainScreen />
        </ThemeProvider>
      </SessionProvider>
    )
  }
}

export default codePush(App)
