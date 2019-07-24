/**

 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, Button, Slider, Alert, ScrollView, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

var sound = new Sound(undefined, () => { }); // e

type Props = {};
export default class App extends Component<Props> {

  constructor(Props) {
    super(Props);
    this.state = { curentRecord: { id: 0 }, ispause: false, audioRecord: [] }
  }

  componentDidMount() {
    // Загрузка списка записей
    // массив записей. 
    // 
    //------------
    this.setState({
      audioRecord: [
        {
          id: 1,
          title: 'mp3 #1',
          url: require('./audioRecord/advertising.mp3'),
          currentTime: 0,
          lastTime: 27,
        },
        {
          id: 2,
          title: 'aac #2',
          url: require('./audioRecord/example.aac'),
          currentTime: 0,
          lastTime: 36,
        },
        {
          id: 3,
          title: 'aac #3',
          url: require('./audioRecord/example.aac'),
          currentTime: 0,
          lastTime: 36,
        },
        {
          id: 4,
          title: 'mp3 #1',
          url: require('./audioRecord/advertising.mp3'),
          currentTime: 0,
          lastTime: 27,
        },
        {
          id: 5,
          title: 'aac #2',
          url: require('./audioRecord/example.aac'),
          currentTime: 0,
          lastTime: 36,
        },
        {
          id: 6,
          title: 'aac #3',
          url: require('./audioRecord/example.aac'),
          currentTime: 0,
          lastTime: 36,
        },
        {
          id: 7,
          title: 'mp3 #1',
          url: require('./audioRecord/advertising.mp3'),
          currentTime: 0,
          lastTime: 27,
        },
        {
          id: 8,
          title: 'aac #2',
          url: require('./audioRecord/example.aac'),
          currentTime: 0,
          lastTime: 36,
        },
        {
          id: 9,
          title: 'aac #3',
          url: require('./audioRecord/example.aac'),
          currentTime: 0,
          lastTime: 36,
        },
      ]
    });
    //-------------

  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }


  //*** функции  */
  // установка интервала
  setIntervalState = () => {
    sound.getCurrentTime((seconds) => {
      this.state.curentRecord.currentTime = Math.round(seconds);
      // this.state.curentRecord.lastTime = Math.round(sound.getDuration()); //эту функции можно не использовать. использовать при загрузке файла.
      this.setState({});
    })
  }
  //\установка интервала

  // функция нажатия кнопки.
  onPressButton(curRecord = { id: 0 }) {
    if ((this.state.curentRecord.id != curRecord.id) || ((this.state.curentRecord.id == curRecord.id) && (this.state.ispause))) {

      this.setState({ curentRecord: curRecord, ispause: false });

      clearInterval(this.timerId);//чистим интервал
      sound.release(); //чистим

      sound = new Sound(curRecord.url, (error) => {

        if (error) { Alert.alert('ERROR. BAD FILE.'); return } // Проверка Файл мог не загрузится.

        sound.setCurrentTime(curRecord.currentTime);
        sound.stop(() => {
          sound.play();
        });

        sound.setNumberOfLoops(-1); // по кругу.
        this.timerId = setInterval(
          this.setIntervalState, 1000);
      });

    } else {
      this.setState({ ispause: true });
      clearInterval(this.timerId);
      sound.pause();
    }
  }

  // функция бегунка
  onChangeSlider = (value,curRecord) => {
    if (curRecord.id == this.state.curentRecord.id) { sound.setCurrentTime(value * this.state.curentRecord.lastTime); }
  }


  //--------------------------------
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 5 }}>

          {this.state.audioRecord.map(curRecord => {
            return (
              <View style={styles.audioRecordStyle}>
                <View style={{ flex: 0.8, }} >
                  <Text> {curRecord.title}   </Text>

                  <Slider
                    value={((curRecord.lastTime) == 0 ? 0 : curRecord.currentTime / curRecord.lastTime)}
                    onValueChange={(value) => { this.onChangeSlider(value, curRecord) }}
                  />
                  <Text> {curRecord.currentTime}  :  {curRecord.lastTime} </Text>
                </View>
                <View style={{ flex: 0.2, }} >
                  <Button
                    onPress={this.onPressButton.bind(this, curRecord)}
                    title={((this.state.curentRecord.id == curRecord.id) && (!this.state.ispause)) ? 'pause' : 'play'} />
                </View>

              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  audioRecordStyle: {

    flexDirection: 'row',
    padding: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgb(180,180,180)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
  },

});
