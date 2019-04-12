/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

export default class App extends Component {
  componentWillMount() {
    nodejs.start('main.js');
    nodejs.channel.addListener(
      'message',
      msg => {
        alert('From node: ' + msg);
      },
      this,
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Reproduction</Text>
        <Button
          title="Run leveldown"
          onPress={() => nodejs.channel.send('anything')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
