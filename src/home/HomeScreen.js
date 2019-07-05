import React from 'react'
import {
  // Animated,
  TextInput,
  ScrollView,
  Dimensions,
  View,
  Text
} from 'react-native'
import * as Icons from '../icons'
import { ThemeContext } from '../Theme'
import { Link } from '../components'

const windowSize = Dimensions.get('window')

function ChildModule (props) {
  const { data } = props
  const Icon = data.icon
  const size = (windowSize.width - (14 + 0.5 + 14) * 2) / 3
  return (
    <Link to={{ routeName: data.to, params: data }}>
      <View style={{ width: size, height: size + 20 }}>
        <View style={{ height: size - 30, alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={size - 50} fill={props.primaryColor} />
        </View>
        <Text style={{
          textAlign: 'center',
          color: props.primaryColor,
          fontSize: 16
        }}>{data.title}</Text>
      </View>
    </Link>
  )
}

export class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarIcon: (props) => (
        <Icons.Home
          size={20}
          fillUp={props.focused}
          fill={props.focused ? props.tintColor : '#999'}
        />
      )
    }
  }

  state = {
    list: [
      { to: 'FiscalTaxList', title: '销售', icon: Icons.FiscalTax },
      { to: 'CompanyList', title: '规模企业', icon: Icons.ScaleEnterprise },
      { to: 'HighEnterprise', title: '高企', icon: Icons.HighEnterprise },
      { to: 'TalentEnterprise', title: '人才企业', icon: Icons.TalentEnterprise },
      { to: 'PublicCompany', title: '上市企业', icon: Icons.PublicCompany },
      { to: 'MoreCompany', title: '更多', icon: Icons.MoreCompany }
    ]
  }

  handleSearchTextChange = (text) => {
    this.props.navigation.navigate('CompanySearchList', { preInputText: text })
  }
  render () {
    const { list } = this.state
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <ScrollView style={{ flex: 1 }}>
            <View style={{ width: windowSize.width, height: windowSize.width / 750 * 405 }}>
              <View style={{ position: 'absolute', top: 0, left: -1 }}>
                <Icons.HomeBg size={windowSize.width + 2} />
              </View>
              <View style={{ position: 'absolute', top: 60, left: (windowSize.width - 120) / 2 }}>
                <Icons.Logo size={120}></Icons.Logo>
              </View>
              <View
              style={{
                position: 'absolute',
                // padding: 14,
                bottom:15,
                left:20,
                width: windowSize.width/1.1,
                height: windowSize.width /10,
              }}
            >
              <TextInput
                placeholder={!this.state.searchFocus ? '请输入企业名/search' : ''}
                placeholderTextColor='#ABAFB5'
                onFocus={e => this.setState({ searchFocus: true })}
                onBlur={e => this.setState({ searchFocus: false })}
                onChangeText={this.handleSearchTextChange}
                style={{
                  color: theme.primaryColor,
                  textAlign: 'left',
                  borderWidth: 1,
                  borderRadius: 10,
                  // borderColor: theme.primaryColor
                  borderColor:'#FFFFFF',
                  backgroundColor:'#FFFFFF'
                }}
              />
            </View>
            </View>
            <View
              style={{
                margin: 14,
                padding: 14,
                borderRadius: 12,
                paddingBottom: 30,
                borderWidth: 0.5,
                borderColor: theme.primaryColor,
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
            >
              {list.map(item => (
                <ChildModule key={item.title} data={item} primaryColor={item.title!='更多' ? theme.primaryColor:'#ABAFB5'} />
              ))}
            </View>
          </ScrollView>
        )}
      </ThemeContext.Consumer>
    )
  }
}
