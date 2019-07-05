/**
 * 消息详情
 */
import React from 'react'
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  FlatList,
} from 'react-native'
import * as Icons from '../icons'
import request from '../request'
import HTML from 'react-native-render-html';

const { height, width } = Dimensions.get('window')
export class MessageDetail extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      messageId: '',
      isAll: '',
      messageDetail: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: '消息详情',
      headerTintColor: '#FFF',
      headerStyle: {
        backgroundColor: '#147dd5'
      }, 
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 23
        // marginLeft: -20
      },
      // headerBackTitleStyle: {
      //   color: '#FFF'
      // },
      headerBackImage: <View><Icons.BackIcon size={20} /></View>,
      headerRight: <View />
    }
  }

  componentDidMount(){
    this.setState({
      messageId: this.props.navigation.state.params.id,
      isAll: this.props.navigation.state.params.isAll
    },()=>{
      this.getMessageDetail()
      this.changeState()
    })
  }

  getMessageDetail(){
    let url = '/v1/message/' + this.state.messageId
    request(url,{
      method: 'GET'
    }).then(res => {
      if(res){
        if(res.message == '成功'){
          let time = new Date(res.data.updateDate)
          let month = time.getMonth() + 1
          let day = time.getDate()
          let hours = time.getHours()
          let minutes = time.getMinutes()
          res.data.date = (month < 10 ? '0' + month : month) 
          + '/' + (day < 10 ? '0' + day : day) 
          + ' ' + (hours < 10 ? '0' + hours : hours) 
          + ':' + (minutes < 10 ? '0' + minutes : minutes)
          res.data.key = res.data.title
  
          this.setState({
            messageDetail: [res.data]
          })
          
        }
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

  changeState(){
    let url = '/v1/message/readed'
    request(url,{
      method: 'POST',
      body: {
        id: this.state.messageId,
        isAll: this.state.isAll
      }
    }).then(res => {
      if(res.message == '成功'){
        console.log('消息已变为已读')
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

  render () {
    return (
      <FlatList
        data={this.state.messageDetail}
        renderItem={({item}) => 
        <View style={styles.container}>
          <View style={styles.messageTitle}>
            <View style={styles.leftTitle}>
              <Text style={styles.leftTitleFont}>{item.title}</Text>
            </View>
            <View style={styles.rightTime}>
              <Text style={styles.rightTimeFont}>{item.date}</Text>
            </View>
          </View>
          <View style={styles.secondTitle}>
            <Text style={styles.secondTitleFont}>
              {item.subTitle}
            </Text>
          </View>
          <View style={styles.content}>
            <HTML html={item.content} imagesMaxWidth={Dimensions.get('window').width} />
          </View>
        </View>
      }
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  messageTitle: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  leftTitle: {
    flex: 1,
    marginRight: 5
  },
  leftTitleFont: {
    fontSize: 24,
    color: '#2A5CD3'
  },
  rightTime: {
    flexDirection: 'column-reverse',
    width: width/5,
  },
  secondTitle: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C7C7'
  },
  secondTitleFont: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'SimHei',
    fontWeight: '900'
  },
  content: {
    paddingTop: 10
  },
  contentFont: {
    fontFamily: 'STXihei',
    fontWeight: '100',
    fontSize: 18
  }
})
