/**
 * 编辑企业介绍
 * ys  2019.6.5
 */
import React,{Component} from 'react'
import {View,Text,TextInput ,Button} from 'react-native'
import request from '../request'
export class CompanyDescriptionEdit extends Component{
    constructor(props){
        super(props)
        this.state={
          introduction:null,
          text:'',
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
          title: '编辑企业介绍',
          headerTintColor: '#FFF',
          headerStyle: {
            /**
             * ??
             * 这个颜色照理说应该使用ThemeContext里的颜色
             * 但是ReactNavigation只支持借助setParams的形式给这个函数传参
             * 而当前最新版本的ReactNative还不支持Hooks API，所以导致比较context不是很‘优雅’
             * 所以暂时这个地方硬编下
             */
            backgroundColor: '#147dd5',
            elevation: 0
          },
          headerBackTitleStyle: {
            color: '#FFF'
          }
        }
      }
      componentDidMount () {
        this.getOrganizationalIntro()
      }
  /**
  * 编辑企业描述
  */
      saveEdit=()=>{
        // alert(this.state.text)
        let url = `/v1/enterprises/base`
        request(url, {
          method: 'PUT',
          body: {
            organizationalCode: this.props.navigation.state.params.id,
            entAbstract: this.state.text
          } 
        }).then((res) => {
          if (res) {
            if (res.message === '更新成功') {
             alert('修改成功！')
             if(this.props.navigation.state.params.linkType==1){
              this.props.navigation.navigate('Me')
             }else{
              this.props.navigation.navigate('CompanyDetails')
             }
             
            } else {
              console.log(res.message)
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
  /**
  * 根据组织代码获取企业介绍
  */
    getOrganizationalIntro= () => {
        let url = `/v1/enterprises/base/queryEntAbstract/${this.props.navigation.state.params.id}`
        request(url, {
          method: 'GET'
        }).then((res) => {
          console.log(res)
          if (res) {
            if (res.message === '查询成功') {
              this.setState({
                introduction:res.data,
                text:res.data,
              })
            } else {
              console.log(res.message)
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    render(){
        return(
            <View>
             <TextInput 
              multiline={true}
              maxLength={1000}
              onChangeText={(text) =>{this.setState({text:text});}} 
             >
              {this.state.introduction}
             </TextInput>
             <View style={{alignItems:'center'}}>
                <Button title='保存' onPress={()=>this.saveEdit()}></Button>
              </View>
            </View>
        )
    }
}