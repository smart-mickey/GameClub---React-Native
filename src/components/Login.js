const React = require('react');
const ReactNative = require('react-native');
import {Actions} from 'react-native-router-flux'
import NavigationBar from 'react-native-navbar';
import Button from 'apsl-react-native-button';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';
import * as firebase from "firebase";
const Database = require('../model/Database');
const {
  Alert,
  TextInput,
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
} = ReactNative;
var Global = require('../Global');
var logo = require('../image/login.jpg');
var { gStyle, } = Global;

firebase.initializeApp({
    apiKey: "AIzaSyB0_RtBbaxaZbt4SRLgjpQJV97zIZslkPQ",
    authDomain: "gameclub-15c6c.firebaseapp.com",
    databaseURL: "https://gameclub-15c6c.firebaseio.com",
    storageBucket: "gameclub-15c6c.appspot.com",
    messagingSenderId: "166488005093"
});

var storage = new Storage({
    // maximum capacity, default 1000  
    size: 1000,
 
    // Use AsyncStorage for RN, or window.localStorage for web. 
    // If not set, data would be lost after reload. 
    storageBackend: AsyncStorage,
    
    // expire time, default 1 day(1000 * 3600 * 24 milliseconds). 
    // can be null, which means never expire. 
    defaultExpires: 1000 * 3600 * 24,
    
    // cache data in the memory. default is true. 
    enableCache: true,
    
    // if data was not found in storage or expired, 
    // the corresponding sync method will be invoked and return  
    // the latest data. 
    sync : {
        // we'll talk about the details later. 
    }
})	

class Login extends React.Component {
  
  constructor(props) {
    super(props);  
    this.state = { 
            Email: '',
            Password: '',
            isLoading: false
        };
    
  }  
  
  componentDidMount() {
        //this.getData('http://ngps.fmbtechservices.com/getLocations.php');
        storage.load({
            key: 'currentUser',
        }).then(ret => {
            // found data goes to then() 
            this.setState({Email: ret.email, Password: '', isLoading: false});
            console.log(ret.userid);
        }).catch(err => {
            // any exception including data not found  
            // goes to catch() 
            //do nothing here
            this.setState({Email: '', Password: '', isLoading: false});
            switch (err.name) {
                case 'NotFoundError':
                    // TODO; 
                    break;
                case 'ExpiredError':
                    // TODO 
                    break;
            }
        });
        //this.signin('julian.mobiledev@gmail.com', 'Mickey2015');
        //Database.InitGameList();
  }

  render() {
    
    return (
        <View style = {{flex: 1, flexDirection: 'row'}}>
        <Image source = {logo} style = {{flex: 1, flexDirection: 'column', resizeMode: 'stretch', alignSelf: 'stretch'}}>
                <View style = {{flex: 0.4}}>

                </View>
                <View style = {{flex: 0.6, padding: 30}}>
                <Text style = {{fontFamily: '28 Days Later', backgroundColor: 'transparent', fontSize: 30, textAlign: 'center'}}>GAME UP</Text>
                <TextInput
                    style = {[gStyle.button, {borderWidth: 0.5, borderColor: 'black', textAlign: 'center', color: 'black', fontSize: 15}]}
                    placeholder = "Email Address"
                    placeholderTextColor = "black"
                    underlineColorAndroid='transparent'
                    keyboardType = 'email-address'
                    onChangeText = {(text) => this.setState({ Email: text })}
                    value = {this.state.Email}
                />
                <TextInput
                    style = {[gStyle.button, {borderWidth: 0.5, borderColor: 'black', textAlign: 'center', color: 'black', fontSize: 15}]}
                    placeholder = "Password"
                    placeholderTextColor = "black"
                    underlineColorAndroid='transparent'
                    secureTextEntry = {true}
                    onChangeText = {(text) => this.setState({ Password: text })}
                    value = {this.state.Password}
                />         

                <Button 
                style = {[gStyle.button, {backgroundColor: '#FF0000CC'}]}
                textStyle = {{color: 'white'}}
                isDisabled = {this.state.isLoading}
                isLoading = {this.state.isLoading}
                activityIndicatorColor = 'black'
                onPress = {() => this.signin(this.state.Email, this.state.Password)}>
                <Text style = {{fontFamily: '28 Days Later', fontSize: 15, color: 'white'}}>Log In</Text>
                </Button>

                <View style = {gStyle.button}>
                    <TouchableOpacity  onPress = {() => this.signup()}>
                        <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style = {{fontFamily: '28 Days Later'}}>New User? Register</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>
        </Image>
        </View>
    );
  }    

  async signin (email, pass) {
    this.setState({ isLoading: true });
        try {
            let user = await firebase.auth()
            .signInWithEmailAndPassword(email, pass);
            
            console.log("Logged In!");

            Database.listenUserDetails((Data) => {
                var un = Data[user.uid].details.username;
                Global.myUsername = un;
                Global.myEmail = email;
                storage.save({
                    key: 'currentUser',   // Note: Do not use underscore("_") in key! 
                    rawData: {
                        email: email,
                        username: un
                    },
                    
                    // if not specified, the defaultExpires will be applied instead. 
                    // if set to null, then it will never expire. 
                    expires: null
                }); 
                this.setState({ isLoading: false });
                Actions.HomeView();
            })
            
            
            // Navigate to the Home page, the user is auto logged in

        } catch (error) {
            console.log(error.toString());
            this.setState({ isLoading: false });
            Alert.alert(error.toString());
        }

    }

    signup(){
        Actions.Register();
    }
    
    
}

module.exports = Login;