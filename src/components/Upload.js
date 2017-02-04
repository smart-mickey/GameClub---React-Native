'use strict';

const React = require('react');
const ReactNative = require('react-native');
const StyleSheet = require('StyleSheet');
import {Actions} from 'react-native-router-flux';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import NavigationBar from 'react-native-navbar';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-simple-modal';
import Button from 'apsl-react-native-button';
import * as firebase from "firebase";
import Database from "../model/Database";
import Model from "../model/Model";
const dismissKeyboard = require('dismissKeyboard');
const {
  Image,
  Alert,
  TextInput,
  View,
  Picker,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView
} = ReactNative;

var Global = require('../Global');
var { gStyle, } = Global;
var camera = require('../image/camera.png');
import RNFetchBlob from 'react-native-fetch-blob'
const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob


class Upload extends React.Component {  

  constructor(props) {
    super(props);    
    this.state = { 
        modal_open: false,
        avatarSource: null,
        imageUrl: '',
        imageName: '',
        comment: '',
        uploading: false,
        imageSelected: false,
        isLoading: false,
        navigationState: {
          index: 0,
          routes: [
            { key: '1', title: 'Picture' },
            { key: '2', title: 'Comment' },
          ],
        }
    };
  }  
 
  _handleChangeTab = (index) => {
      this.setState({
        navigationState: {
                                index: index,
                                routes: [
                                  { key: '1', title: 'Picture' },
                                  { key: '2', title: 'Comment' },
                                ],
                          }
      });
  };
 
  _renderHeader = (props) => {
    return <TabBar {...props} tabStyle = {{backgroundColor: '#3d3d3d'}} />;
  };

  selectPhotoTapped() {
      dismissKeyboard();
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true
        }
      };

      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled photo picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          var source;

          // You can display the image using either:
          // source = { uri: 'data:image/jpeg;base64,' + response.data };

          // Or:
          if (Platform.OS === 'android') {
            source = { uri: response.uri };
            this.setState({imageUrl: response.uri});
          } else {
            source = { uri: response.uri.replace('file://', '') };
            this.setState({imageUrl: response.uri.replace('file://', '')});
          }
          this.setState({
            avatarSource: source,
            imageSelected: true,
          });
        }
      });
  }
 
  render() {
    var _this = this;
    const leftButtonConfig = {
        title: '< Back',
        style: {
          marginTop: 15,
        },
        tintColor: 'white',
        handler: function () {
            if(_this.state.isLoading == true) return;
            Actions.pop();
        },
    };
    return (
      <View style = {{flex: 1, backgroundColor: 'white'}}>
                <NavigationBar
                    style = {{backgroundColor: '#1d1d1d', marginTop:-20, height:80}}
                    leftButton = {leftButtonConfig}
                />
                <View style = {{flex: 1, flexDirection: 'column', paddingBottom: 330, padding: 10}}>
                      <TextInput
                        style = {{flex: 1, borderBottomWidth: 0.5, borderColor: 'black', fontSize: 18, padding: 10, color: 'black', fontWeight: 'bold', textAlignVertical: 'top'}}
                        placeholder = "Title"
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => this.setState({ imageName: text })}
                        multiline = {true}
                        editable = {true}
                        maxLength = {128}
                      />
                      <TextInput
                        style = {{flex: 4, flexDirection: 'column', fontSize: 18, padding: 10, color: 'black', textAlignVertical: 'top'}}
                        placeholder = "Type your comment here..."
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => this.setState({ comment: text })}
                        multiline = {true}
                        editable = {true}
                        maxLength = {1024}
                      />
                </View>

                <View style = {{position: 'absolute', backgroundColor: 'white', flex: 1, flexDirection: 'column', bottom: 80, left: 0, right: 0, height: 250, justifyContent: 'center', alignItems: 'center'}}>
                  <View>
                  <TouchableOpacity onPress = {() => this.selectPhotoTapped()} style = {{width:200, height:200, borderColor: 'black', borderWidth: 0.5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                    { this.state.avatarSource == null ?
                      <Image source = {camera}  style={{width:90, height:70}}></Image> :
                      <Image source={this.state.avatarSource} style={{width:200, height:200}} />
                    }
                  </TouchableOpacity>
                  </View>
                  <View>
                  <Text style = {{fontFamily: '28 Days Later', fontSize: 15, color: 'black', padding: 5}}>Add Photo</Text>
                  </View>
                </View>
                <View style = {{position: 'absolute', backgroundColor: 'white', bottom: 0, left: 0, right: 0, height: 80, justifyContent: 'center', alignItems: 'center', paddingLeft: 50, paddingRight: 50}}>
                    <Button style = {[gStyle.button, {backgroundColor: '#1d1d1d'}]}
                    textStyle = {{color: 'white'}}
                    isDisabled = {this.state.isLoading}
                    isLoading = {this.state.isLoading}
                    activityIndicatorColor = 'yellow'
                    onPress = {() => this.post()}>
                        <Text style = {{fontFamily: '28 Days Later', fontSize: 15, color: 'white'}}>Post Now</Text>
                    </Button>
                </View>
      </View>
    );
  }

 
  post() {     
      
      if(Model.checkEmptyField(this.state.imageName)){
        alert("The title is empty!");
        return;
      }
      else if(Model.checkEmptyField(this.state.comment)){
        alert("Your comment is empty!");
        return;
      }
      else if(!this.state.imageSelected){
        alert("Image unselected!");
        return;
      }
      this.setState({isLoading: true});
      let rnfbURI = RNFetchBlob.wrap(this.state.imageUrl);
      let filename = this.state.imageName + '-Mickey2015-' + Model.getDate() + '.jpg';
      // create Blob from file path
      Blob.build(rnfbURI, { type : 'image/jpg;'})
      .then((blob) => {
        // upload image using Firebase SDK
        return firebase.storage()
          .ref('rn-firebase-upload')
          .child(filename)
          .put(blob, { contentType : 'image/jpg' })
          .then((snapshot) => {
            alert('Uploaded successfully!');            
            this.addToGameList(filename);
            this.setState({isLoading: false});
            Actions.pop();
            blob.close();
          });
      })
      .catch(error => {
        console.log('One of the above operations failed', error)
      })
  }

  addToGameList(name) {
     var timestamp = new Date().getTime();
     Database.setImagetoGameList(name, timestamp, this.state.comment);
  }

}
module.exports = Upload;