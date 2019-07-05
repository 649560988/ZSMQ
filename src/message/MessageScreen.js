import React from 'react'
import {
  View,
  TextInput,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  AsyncStorage,
  Alert
} from 'react-native'
import * as Icons from '../icons'
import { Link } from '../components'
import request from '../request'
import { __values } from 'tslib';

const { height, width } = Dimensions.get('window')

export class MessageScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      searchText: '',
      messageList: [],
      pageNo: 1,
      pageSize: 4,
      noMoreData: false,
      getMoreData: false,
      lastId: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: '消息',
      tabBarLabel: '消息',
      tabBarIcon: (props) => (
        <Icons.Message
          size={30}
          stroke={props.focused ? props.tintColor : '#999'}
          fill={props.focused ? props.tintColor : '#fff'}
          fillCircle={props.focused ? '#fff' : '#999'}
        />
      )
    }
  }

  componentDidMount () {
    this.getMessageList()
  }
  getMessageList (flag = 0) {
    AsyncStorage.getItem('userToken').then((__values)=>{
      const jsonValue = JSON.parse(__values);
      if(jsonValue==null){
        let url = ''
        if (flag) {
          url = '/v1/message/queryAllCanSee?pageNo=' + this.state.pageNo + '&pageSize=' + this.state.pageSize + '&content=' + this.state.searchText
        } else {
          url = '/v1/message/queryAllCanSee?pageNo=' + this.state.pageNo + '&pageSize=' + this.state.pageSize
        }
        this.getMessageListRequest(url,flag)
      }else{
        let url = ''
        if (flag) {
          url = '/v1/message/queryAll?pageNo=' + this.state.pageNo + '&pageSize=' + this.state.pageSize + '&content=' + this.state.searchText
        } else {
          url = '/v1/message/queryAll?pageNo=' + this.state.pageNo + '&pageSize=' + this.state.pageSize
        }
       this.getMessageListRequest(url,flag)
      }
    })
  }
  getMessageListRequest=(url,flag)=>{
    request(url, {
      method: 'GET'
    })
      .then((res) => {
        if (res) {
          if (res.message == '成功') {
            res.data.list.map((val) => {
              let time = new Date(val.updateDate)
              let month = time.getMonth() + 1
              let day = time.getDate()
              let hours = time.getHours()
              let minutes = time.getMinutes()
              val.date = (month < 10 ? '0' + month : month) +
            '/' + (day < 10 ? '0' + day : day) +
            ' ' + (hours < 10 ? '0' + hours : hours) +
            ':' + (minutes < 10 ? '0' + minutes : minutes)
              val.key = val.title
            })
            if (res.data.list.length > 0 && flag == 2) {
              this.setState({
                messageList: [...this.state.messageList, ...res.data.list]
              }, () => {
                this.setState({
                  getMoreData: false,
                  lastId: this.state.messageList[this.state.messageList.length - 1].id
                })
              })
            } else if (res.data.list.length > 0) {
              this.setState({
                messageList: res.data.list,
                refreshing: false
              })
            } else {
              this.setState({
                noMoreData: true
              })
            }
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.getMessageList()
  }

  getMoreMessage () {
    this.setState({
      getMoreData: true,
      pageNo: this.state.pageNo + 1
    }, () => {
      this.getMessageList(2)
    })
  }

  renderMessageList () {
    let { height, width } = Dimensions.get('window')

    return <FlatList
      onEndReachedThreshold={0.1}
      onEndReached={() => { this.getMoreMessage() }}
      data={this.state.messageList}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          colors={['blue']}
        />
      }
      renderItem={({ item }) =>
        <Link to={{ routeName: 'MessageDetail', params: { id: item.id, isAll: item.isAll } }}>
          <View style={styles.messageCard}>
            <View style={styles.cardLeft}>
              <Text style={styles.messageTitle}>{item.title = item.title && item.title.length > 13 ? item.title.substring(0, 13) + '...' : item.title}</Text>
              <Text style={styles.secondTitle}>{item.subTitle = item.subTitle && item.subTitle.length > 45 ? item.subTitle.substring(0, 45) + '...' : item.subTitle}</Text>
              {/* <Text style={styles.messageContent}>{item.content = item.content.length>48?item.content.substring(0,48)+'...':item.content}</Text> */}
              <Text style={styles.messageDate}>{item.date}
              </Text>
            </View>
            {
              item.isRead == '1' ? <View style={styles.cardRightYes} /> : <View style={styles.cardRightNo} />
            }
          </View>
          {item.id == this.state.lastId && this.state.getMoreData && !this.state.noMoreData && this.state.messageList.length != 0 && <View style={styles.loadingCon}>
            <ActivityIndicator size='small' color='#ED4F4F' />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>}
          {item.id == this.state.lastId && this.state.getMoreData && this.state.noMoreData && this.state.messageList.length != 0 && <View>
            <Text style={styles.noMoreDataText}>没有更多数据</Text>
          </View>}
        </Link>
      }
    />
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{ width: width, height: 60, backgroundColor: '#147dd5', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 23 }}>信息</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.twoContainer}>
            <TextInput
              style={styles.searchInput}
              onChangeText={(searchText) => this.setState({ searchText })}
              onSubmitEditing={() => { this.getMessageList(1) }}
              value={this.state.searchText}
              placeholder='搜索'
            />
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => this.setState({ searchText: '' })}>
                <Icons.CloseSearch size={32} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.renderMessageList()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F5'
  },
  searchContainer: {
    alignItems: 'center'
  },
  twoContainer: {
    flexDirection: 'row',
    backgroundColor: 'red',
    width: width / 1.1,
    margin: 15,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 5,
    borderWidth: 1
  },
  searchInput: {
    flex: 7,
    height: 45,
    paddingLeft: 10,
    borderColor: '#fff',
    fontSize: 20,
    color: '#A1A3A3'
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    borderColor: '#fff',
    height: 45
  },
  closeIcon: {
    position: 'absolute',
    marginLeft: '-50'
  },
  messageCard: {
    height: height / 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  cardLeft: {
    padding: 15,
    flex: 1,
    flexDirection: 'column'
  },
  cardRightNo: {
    width: width / 22,
    backgroundColor: '#387CD8'
  },
  cardRightYes: {
    width: width / 22,
    backgroundColor: '#898A8B'
  },
  messageTitle: {
    fontSize: 24,
    color: '#2A5CD3',
    flex: 2
  },
  secondTitle: {
    fontSize: 18,
    color: '#000000',
    flex: 3
  },
  messageContent: {
    flex: 2
  },
  messageDate: {
    flex: 1
  },
  loadingCon: {
    height: 40,
    justifyContent: 'center'
  },
  loadingText: {
    textAlign: 'center'
  },
  noMoreDataText: {
    height: 25,
    textAlign: 'center'
  }
})
