/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Slider } from 'react-native';
import Sound from 'react-native-sound';
import { isTSTypeAliasDeclaration } from '@babel/types';

// import MainView from './main.js';
var sound = new Sound(undefined, () => { });


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const audioRecord = [

  {
    id: 1,
    title: 'mp3 #1',
    url: require('./advertising.mp3'),
    currentTime: 0,
    lastTime:27,

  },

  {
    id: 2,
    title: 'aac #2',
    url: require('./example.aac'),
    currentTime: 0,
    lastTime:36,
  },
  {
    id: 3,
    title: 'aac #3',
    url: require('./example.aac'),
    currentTime: 0,
    lastTime:36,
  },

];

type Props = {};
export default class App extends Component<Props> {

  constructor(Props) {
    super(Props);
    this.state = { curentRecord: { id: 0 }, ispause:false }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  mySetState = () => {
    sound.getCurrentTime((seconds) => {
      audioRecord.map((el) => {
        el.currentTime = (this.state.curentRecord.id == el.id) ? Math.round(seconds) : el.currentTime;
        el.lastTime = (this.state.curentRecord.id == el.id) ? Math.round(sound.getDuration()) : el.lastTime;
      
      })

      this.setState({});

    })
  }

  timerId = undefined;

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>

        {audioRecord.map(curRecord => {
          return (
            <View style={{

              flexDirection: 'row',
              padding: 10,
              alignSelf: 'stretch',
              alignItems: 'center',
              borderTopWidth: 1,
              borderTopColor: 'rgb(180,180,180)',
              borderBottomWidth: 1,
              borderBottomColor: 'rgb(230,230,230)',
            }}>
              <View style={{ flex: 0.8, }} >
              <Text> {curRecord.title}   </Text>

                <Slider
                  value={curRecord.currentTime/((curRecord.lastTime)==0?1:curRecord.lastTime)}
                  onValueChange={value => {
                    sound.setCurrentTime(value);
                  } }
                />
                <Text> {curRecord.currentTime}  :  {curRecord.lastTime} </Text>
              </View>
              <View style={{ flex: 0.2, }} >
                <Button
                  onPress={
                    () => {
                     
                      if ((this.state.curentRecord.id != curRecord.id) || ((this.state.curentRecord.id == curRecord.id) && (this.state.ispause) )   ) {

                        this.setState({ curentRecord: curRecord, ispause:false });

                        clearInterval(this.timerId);
                        sound.release();

                        sound = new Sound(curRecord.url, (error) => {
                          sound.setCurrentTime(curRecord.currentTime);
                          sound.play();
                          sound.setNumberOfLoops(-1);

                          this.timerId = setInterval(
                            this.mySetState, 1000);
                        });

                      } else {
                        this.setState({ispause:true});
                        clearInterval(this.timerId);
                        sound.pause();
                      }
                    }
                  }
                  title={((this.state.curentRecord.id == curRecord.id)  && (!this.state.ispause)) ? 'pause' : 'play'} />
              </View>

            </View>
          );
        })}

      </View>
    );
  }
}
