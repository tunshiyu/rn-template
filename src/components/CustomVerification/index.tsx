/* eslint-disable complexity */
import React from 'react';
import { useImmer } from 'use-immer';
import {
  View,
  StyleSheet,
  PanResponder,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  ImageSourcePropType
} from 'react-native';

const defalutRightMove = 164;
const defalutOffset = 3;
const defalutItemImg = { uri: 'https://necaptcha.nosdn.127.net/e64b10592be349dda2684e91678c221a@2x.png' };
const defalutBackGroundImg = { uri: 'https://necaptcha.nosdn.127.net/d9a5865962df4431a0dce6b8c5a8dfa9@2x.jpg' };

interface VerificationProps {
  backGroundImg?: ImageSourcePropType;
  itemImg?: ImageSourcePropType;
  rightMove?: number;
  offset?: number;
  getValue: (v: boolean) => void;
  scrollWidth?: number;
  btnWidth?: number;
}

export default function Verification(props: VerificationProps) {
  let move = 0;
  let scrollView: View;
  let scrollContainer: View;
  let scrollImg: View;
  let scrollText: View;

  const initialConfig = {
    result: 'null',
    opacity: 1,
    backGroundImg: props.backGroundImg || defalutBackGroundImg,
    itemImg: props.itemImg || defalutItemImg,
    rightMove: props.rightMove || defalutRightMove, //正确位置
    offset: props.offset || defalutOffset, //偏差量
    scrollWidth: props.scrollWidth || 300, //整体宽度
    btnWidth: props.btnWidth || 40 //滑块宽度
  };

  const [storageModalConfig, setStorageModalConfig] = useImmer(initialConfig);
  const { result, scrollWidth, btnWidth, rightMove, offset, backGroundImg, itemImg, opacity } = storageModalConfig;

  const _onShouldSetPanResponder = (_: any, gesture: { dy: number; dx: number }) => {
    if (Math.abs(gesture.dy) < Math.abs(gesture.dx)) {
      setStorageModalConfig(config => {
        config.opacity = 1;
      });
      return true;
    }
    return false;
  };
  const _onPanResponderMove = (_: any, gesture: { dx: number }) => {
    move = gesture.dx;

    const maxMove = scrollWidth - btnWidth;
    if (move < 0) {
      move = 0;
    }
    if (move >= maxMove) {
      move = maxMove;
    }
    scrollContainer.setNativeProps({ style: { width: move } });
    scrollImg.setNativeProps({ style: { left: move } });
  };
  const _onPanResponderRelease = () => {
    scrollContainer.setNativeProps({ style: { width: 0 } });
    scrollImg.setNativeProps({ style: { left: 0 } });
    scrollText.setNativeProps({ style: { opacity: 1 } });
    if (rightMove - offset <= move && move <= rightMove + offset) {
      setStorageModalConfig(config => {
        config.result = 'true';
      });
      props.getValue && props.getValue(true);
    } else {
      props.getValue && props.getValue(false);
      scrollView.setNativeProps({ style: { borderColor: '#f54c47' } });
      setStorageModalConfig(config => {
        config.result = 'false';
      });
    }
    move = 0; //清空上一次的位置
    scrollText.setNativeProps({ style: { opacity: 1 } });
  };
  const _onPanResponderGrant = () => {
    setStorageModalConfig(config => {
      config.result = 'null';
    });
    move = 0; //清空上一次的位置
    scrollText.setNativeProps({ style: { opacity: 0 } });
    scrollView.setNativeProps({ style: { borderColor: '#2693f7' } });
  };

  const _turn = (code: string | 'false' | 'true' | 'null', type: string) => {
    if (code === 'null') {
      switch (type) {
        case 'img':
          return require('./images/rightArrow.png');
          break;
        case 'text':
          return '向右滑动滑块填充拼图';
          break;
        case 'backgroundColor':
          return '#2693f7';
          break;
      }
    }
    if (code === 'false') {
      switch (type) {
        case 'img':
          return require('./images/error.png');
          break;
        case 'text':
          return '校验失败';
          break;
        case 'backgroundColor':
          return '#fff';
          break;
      }
    }
    if (code === 'true') {
      switch (type) {
        case 'img':
          return require('./images/right.png');
          break;
        case 'text':
          return '校验成功';
          break;
        case 'backgroundColor':
          return '#fff';
          break;
      }
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: _onShouldSetPanResponder,
    onMoveShouldSetPanResponder: _onShouldSetPanResponder,
    onPanResponderGrant: _onPanResponderGrant,
    onPanResponderMove: _onPanResponderMove,
    onPanResponderRelease: _onPanResponderRelease,
    onPanResponderTerminate: _onPanResponderRelease
  });

  const defalutStyles = StyleSheet.create({
    randomView: {
      //验证码View
      backgroundColor: '#F2F2F2',
      height: Platform.OS === 'ios' ? 45 : 34,
      flexDirection: 'row',
      paddingHorizontal: 3,
      alignItems: 'center',
      justifyContent: 'center'
    },
    randomText: {
      fontSize: 28,
      paddingHorizontal: 5,
      fontWeight: 'bold'
    },
    arrowImgView: {
      width: initialConfig.btnWidth,
      height: 38,
      justifyContent: 'center',
      alignItems: 'center'
    },
    arrowImg: {
      height: 26,
      width: 26
    },
    backgroundImg: {
      width: initialConfig.scrollWidth,
      resizeMode: 'cover',
      height: 150,
      position: 'absolute',
      left: -1,
      top: -160,
      zIndex: 2,
      opacity: 0
    },
    imgContainer: {
      width: initialConfig.scrollWidth,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: 40,
      borderWidth: 1,
      borderColor: '#2693f7',
      position: 'relative'
    },
    marginView: {
      height: 38,
      backgroundColor: '#d2e9fd'
    },
    partImg: {
      height: 150,
      resizeMode: 'cover',
      position: 'absolute',
      left: -1,
      top: -160,
      zIndex: 3,
      width: 45,
      opacity: 0
    },
    imgTextView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    imgText: {
      color: '#45494c'
    }
  });

  return (
    <View
      ref={c => {
        scrollView = c!;
      }}
      style={[defalutStyles.imgContainer]}
      {...panResponder.panHandlers}>
      <View
        ref={c => {
          scrollContainer = c!;
        }}
        style={defalutStyles.marginView}></View>
      <Image
        ref={c => {
          scrollImg = c!;
        }}
        source={itemImg}
        style={[defalutStyles.partImg, { opacity: opacity }]}
      />
      <Image source={backGroundImg} style={[defalutStyles.backgroundImg, { opacity: opacity }]} />
      <TouchableOpacity style={[defalutStyles.arrowImgView, { backgroundColor: _turn(result, 'backgroundColor') }]}>
        <Image style={[defalutStyles.arrowImg]} source={_turn(result, 'img')} />
      </TouchableOpacity>
      <View
        ref={c => {
          scrollText = c!;
        }}
        style={[defalutStyles.imgTextView]}>
        <Text style={[defalutStyles.imgText]}>{_turn(result, 'text')}</Text>
      </View>
    </View>
  );
}
