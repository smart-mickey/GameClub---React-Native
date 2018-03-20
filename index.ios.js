/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

const React = require('react');
const ReactNative = require('react-native');
const StyleSheet = require('StyleSheet');
const Login = require('./src/components/Login');
const HomeView = require('./src/components/HomeView');
const Upload = require('./src/components/Upload');
const Register = require('./src/components/Signup');
const GameRoom = require('./src/components/GameRoom');
const PostRoom = require('./src/components/PostRoom');
const Preview = require('./src/components/PreviewImage');
import {Actions, Scene, Router} from 'react-native-router-flux';
const {
  AppRegistry,
  Text,
  View
} = ReactNative;

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="Login" component={Login} hideNavBar={true} title="Login"/>
    <Scene key="HomeView" component={HomeView} hideNavBar={true} title="HomeView"/>
    <Scene key="Upload" component={Upload} hideNavBar={true} title="Upload"/>
    <Scene key="Register" component={Register} hideNavBar={true} title="Register"/>  
    <Scene key="GameRoom" component={GameRoom} hideNavBar={true} title="GameRoom"/> 
  </Scene>
);

class GameClub extends React.Component {
  

  render() {
    
    return (      
      <Router scenes={scenes}/>
    );
  }
}

AppRegistry.registerComponent('GameClub', () => GameClub);
