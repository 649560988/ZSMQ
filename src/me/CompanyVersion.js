/**
 * 企业版本号
 */
import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import * as Icons from '../icons'
export class CompanyVersion extends React.Component {
    render() {
        const { width, height } = Dimensions.get('window')
        return ( 
        <View style = {
                { flexDirection: 'column', alignItems: 'center' } } >
            <View style = {
                { width: width, height: height / 2.35, alignItems: 'center', justifyContent: 'flex-end' } } >
            <Icons.CompanyLogo size = { width / 2.512 }/> </View> <Text style = {
                { color: '#8D8D8D', fontSize: 26, fontFamily: '黑体' } } > 掌上孟企6 .7 .4 </Text> </View>
        )
    }
}