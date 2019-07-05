import {
  Alert,
  AsyncStorage
} from 'react-native'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

async function getNewToken (currentUser, url, options) {
  let userToken = {}
  await fetch('http://api.zsmq.console.retailsolution.cn/oauth/token?client_id=client&client_secret=secret&grant_type=password&password=' + currentUser.loginPassword + '&type=111&username=' + currentUser.userName, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then((response) => response.json()
  ).then((res) => {
    // console.log('刷新tokenL')
    // console.log(res)
    if (res.error) {
      Alert.alert('错误', res.error)
    } else {
      let accessToken = res.data.access_token
      let expiresIn = res.data.expires_in
      let refreshToken = res.data.refresh_token
      let scope = res.data.scope
      let tokenType = res.data.token_type
      userToken.accessToken = accessToken
      userToken.expiresIn = expiresIn
      userToken.refreshToken = refreshToken
      userToken.scope = scope
      userToken.tokenType = tokenType
      AsyncStorage.setItem('userToken', JSON.stringify(userToken), async function (error) {
        if (error) {
          Alert.alert('登录失败', 'userToken储存失败')
        } else {
          if (options.body) {
            options.body = JSON.parse(options.body)
          }
          // console.log('刷新成功')
          Alert.alert('提示', 'token过期，请刷新页面或重新登录')
          await request(url, options)
        }
      })
    }
  }
  ).catch((err) => {
    console.log(err)
  })
  // return userToken
}
async function getAuthorization (userToken) {
  try {
    if (!userToken) {
      return null
    }
    if (!userToken.accessToken) {
      return null
    }
    if (!userToken.refreshToken) {
      return null
    }
    if (!userToken.scope) {
      return null
    }
    if (!userToken.tokenType) {
      return null
    }
    if (userToken.expiresIn > 0) {
      return userToken.tokenType + userToken.accessToken
      // return userToken.tokenType + 'ea0ca681-b174-4bbc-817d-be918e613fbf'
    }
    // console.log('刷新token了')
    const res = await fetch('http://api.zsmq.console.retailsolution.cn/oauth/token?client_id=client&client_secret=secret&grant_type=password&password=' + this.state.password + '&type=111&username=' + this.state.userName, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => response.json()).then((result) => result).catch((error) => {
      console.log(error)
      Alert.alert('错误', '刷新token失败')
    })
    // const json = res
    let newUserToken = {}
    newUserToken.accessToken = res.data.access_token
    newUserToken.expiresIn = res.data.expires_in
    newUserToken.refreshToken = res.data.refresh_token
    newUserToken.scope = res.data.scope
    newUserToken.tokenType = res.data.token_type
    AsyncStorage.setItem('userToken', JSON.stringify(newUserToken), function (error) {
      if (error) {
        Alert.alert('错误', 'userToken储存失败')
      }
    })
    return newUserToken.tokenType + newUserToken.accessToken
  } catch (e) {
    return null
  }
}

export default async function request (url, options) {
  try {
    const newOptions = options
    let userToken = null
    newOptions.method = newOptions.method.toUpperCase()
    await AsyncStorage.getItem('userToken', function (error, result) {
      if (error) {
        userToken = null
      } else {
        userToken = JSON.parse(result)
        console.log(userToken)
      }
    })
    const Authorization = await getAuthorization(userToken)
    if (Authorization) {
      if (!newOptions.headers) {
        newOptions.headers = {}
      }
      newOptions.headers.Authorization = Authorization
    }

    if (
      newOptions.method === 'POST' ||
      newOptions.method === 'PUT' ||
      newOptions.method === 'DELETE'
    ) {
      if (newOptions.body) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers
        }
        newOptions.body = JSON.stringify(newOptions.body)
      } else {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          ...newOptions.headers
        }
      }
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers
      }
    }
    let longUrl = 'http://api.zsmq.console.retailsolution.cn' + url
    // let res = fetch(longUrl, newOptions).then((response) => response.json())
    let response = await fetch(longUrl, newOptions)
    // console.log(response.status)
    let res
    if (response.status >= 200 && response.status < 300) {
      res = await response
    } else {
      // console.log(userToken)
      console.log(response)
      // Alert.alert('错误', `请求错误 ${response.status}: ${response.url}:${codeMessage[response.status] || response.statusText}`)
      console.log(`请求错误 ${response.status}: ${response.url}:${codeMessage[response.status] || response.statusText}`)
      res = await response
      // return res
    }
    let data = await res.json()
    let currentUser = {}
    // console.log(data)
    if (data.error) {
      if (data.error === 'invalid_token') {
        await AsyncStorage.getItem('currentUser', function (error, result) {
          if (error) {
            Alert.alert('错误', '获取当前登录人信息失败')
          } else {
            currentUser = JSON.parse(result)
            // console.log(currentUser)
          }
        })
        await getNewToken(currentUser, url, options)
      } else {
        return data
      }
    } else {
      if (newOptions.method === 'DELETE' || res.status === 204) {
        return await res.text()
      }
      return data
    }
  } catch (e) {
    // const status = e.name
    console.log(e)
    Alert.alert('错误', e)
  }
}
