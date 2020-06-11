/*
 * @文件描述: 首页
 * @公司: thundersdata
 * @作者: 黄姗姗
 * @LastEditors: 于效仟
 * @Date: 2020-01-13 20:17:32
 * @LastEditTime: 2020-06-11 11:35:32
 */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Container from '../../components/Container';
import { Color } from '../../config';
import Verification from '../../components/CustomVerification';

const Home = () => {
  return (
    <Container>
      <ScrollView style={{ backgroundColor: Color.backgroundColor }}>
        <Text>首页</Text>
      </ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Verification getValue={(value: any) => console.log(value)} />
      </View>
    </Container>
  );
};

export default Home;
