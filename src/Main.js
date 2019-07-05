import React from 'react'
import {
  Platform,
  PermissionsAndroid,
  StatusBar,
  Dimensions,
  View,
  AsyncStorage
} from 'react-native'

import {
  createAppContainer,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation'

import { ThemeContext } from './Theme'
import { SessionContext } from './Session'
import { MessageScreen } from './message/MessageScreen'
import { MessageDetail } from './message/MessageDetail'
import { HomeScreen } from './home/HomeScreen'
import { MeScreen } from './me/MeScreen'
import { CompanyVersion } from './me/CompanyVersion'
import { PasswordUpdate } from './me/PasswordUpdate'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { Login } from './me/Login'
import { Register } from './me/Register'
import { RegisterPage2 } from './me/RegisterPage2'
import * as Icons from './icons'

import { CompanySearchList } from './home/CompanySearchList'
import { CompanyList } from './home/CompanyList'
import { MoreCompany } from './home/MoreCompany'
import { FiscalTaxList } from './home/FiscalTaxList'
import { HighEnterprise } from './home/HighEnterprise'
import { TalentEnterprise } from './home/TalentEnterprise'
import { PublicCompany } from './home/PublicCompany'
import { CompanyDetails } from './home/CompanyDetails'
import {CompanyDescription}from './home/CompanyDescription' //企业介绍
import {CompanyDescriptionEdit}from './home/CompanyDescriptionEdit' //编辑企业介绍
import {FinanceInformation} from './home/FinanceInformation'//财务信息
import { from } from 'rxjs/observable/from';
const TabbarScreen = createMaterialTopTabNavigator({
  Message: {
    screen: MessageScreen
  },
  Home: {
    screen: HomeScreen
  },
   Me: {
    screen: MeScreen
   }
}, {
  tabBarOptions: {
    style: {
      borderTopWidth: 1,
      borderTopColor: '#c4c4c4',
      backgroundColor: '#fff'
    },
    indicatorStyle: {
      height: 0
    },
    activeTintColor: '#147dd5',
    shifting: true,
    showIcon: true,
    showLabel: false
  },
  labeled: false,
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  initialRouteName: 'Home'
},
{
  initialRouteName:'Home'
})

export const AppStack = createStackNavigator({

  TabBar: {
    screen: TabbarScreen,
    navigationOptions: ({ navigation }) => {
      return { header: null }
    }
  },
  CompanySearchList: {
    screen: CompanySearchList
  },
  CompanyList: {
    screen: CompanyList,
    navigationOptions: () => {
      return {
        title: '规模企业',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5',
          elevation: 0
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  },
  FiscalTaxList: {
    screen: FiscalTaxList,
    navigationOptions: () => {
      return {
        title: '销售',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5',
          elevation: 0
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  },
  MoreCompany: {
    screen: MoreCompany,
    navigationOptions: () => {
      return {
        title: '更多企业',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5',
          elevation: 0
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  }, 
   //wyw add
  CompanyDescription: {
    screen: CompanyDescription,
    navigationOptions: () => {
      return {
        title: '企业介绍',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5',
          elevation: 0
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  },
  CompanyDescriptionEdit: {
    screen: CompanyDescriptionEdit,
    navigationOptions: () => {
      return {
        title: '编辑企业介绍',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5',
          elevation: 0
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  },
  FinanceInformation: {
    screen: FinanceInformation,
    navigationOptions: () => {
      return {
        title: '财务信息',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5',
          elevation: 0
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  }, Login: {
    screen: Login
  },
  Register: {
    screen: Register,
    navigationOptions: () => {
      return {
        title: '注册账号',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5'
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  },
  RegisterPage2: {
    screen: RegisterPage2,
    navigationOptions: () => {
      return {
        title: '注册账号',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5'
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  },

  // wy auth
  MessageDetail: {
    screen: MessageDetail
  },

  HighEnterprise: {
    screen: HighEnterprise
  },

  TalentEnterprise: {
    screen: TalentEnterprise
  },

  PublicCompany: {
    screen: PublicCompany
  },

  // xqm added start
  CompanyVersion: {
    screen: CompanyVersion,
    navigationOptions: ({ navigation, navigationOptions }) => {
      return {
        title: '企业版本',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5'
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  },
  PasswordUpdate: {
    screen: PasswordUpdate,
    navigationOptions: () => {
      return {
        title: '修改密码',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5'
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>
      }
    }
  },
  CompanyDetails: {
    screen: CompanyDetails,
    navigationOptions: () => {
      return {
        // title: '企业详情',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center',
          fontSize: 23,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: '#147DD5',
          elevation: 0
        },
        headerBackImage: <View><Icons.BackIcon size={20} /></View>,
        headerRight: <View />
      }
    }
  }
  // //////end///////////////
}, {
  initialRouteName: 'TabBar'
})

// export const AuthStack = createStackNavigator({
 
// }, {
//   initialRouteName: 'Login'
// })

export const Route = createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppStack,
  // SignIn: AuthStack
  SignIn: AppStack
}, {
  initialRouteName: 'AuthLoading'
}))

export class MainScreen extends React.Component {
  static router = AppStack.router

  componentDidMount () {
    if (Platform.OS === 'android') {
      this.checkPermissionAndroid()
    }
  }

  checkPermissionAndroid = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ])
    } catch (err) {
    }
  }

  render () {
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <>
            <StatusBar
              backgroundColor={theme.primaryColor}
            />
            <Route />
          </>
        )}
      </ThemeContext.Consumer>
    )
  }
}
