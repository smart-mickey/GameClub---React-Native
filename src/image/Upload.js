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
const {
  Image,
  Alert,
  TextInput,
  View,
  Picker,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity
} = ReactNative;

var Global = require('../Global');
var { gStyle, } = Global;
var camera = require('../image/Camera.png');
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
        rButtonText: 'Upload',
        imageSelected: false,
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
            Actions.pop();
        },
    };

    // const rightButtonConfig = {
    //     title: (this.state.rButtonText),
    //     style: {
    //       marginTop: 15,
    //     },
    //     tintColor: 'white',
    //     handler: function () {
    //         if(_this.state.uploading == false) _this.postImage();;
    //     },
    // };
   
    // const titleConfig = {
    //     title: 'Post Page',
    //     tintColor: 'yellow',
    //     style: {
    //       fontSize: 20
    //     }
    // };
    return (
      <View style = {{flex: 1, backgroundColor: '#2d2d2d'}}>
                <NavigationBar
                    style = {{backgroundColor: '#1d1d1d', marginTop:-20, height:80}}
                    leftButton = {leftButtonConfig}
                />
                <View style = {{flex: 1, flexDirection: 'column', paddingBottom: 200}}>
                  <View style = {{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      style = {{flex: 1, borderBottomWidth: 0.5, borderColor: 'black', fontSize: 18, padding: 5, color: 'black', fontWeight: 'bold', textAlignVertical: 'top'}}
                      placeholder = "title"
                      placeholderTextColor = 'gray'
                      onChangeText = {(text) => this.setState({ comment: text })}
                      multiline = {true}
                      editable = {true}
                      maxLength = {128}
                    />
                  </View>
                  <View style = {{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      style = {{flex: 1, fontSize: 18, padding: 5, color: 'black', textAlignVertical: 'top'}}
                      placeholder = "type your comment here..."
                      placeholderTextColor = 'gray'
                      onChangeText = {(text) => this.setState({ comment: text })}
                      multiline = {true}
                      editable = {true}
                      maxLength = {1024}
                    />
                  </View>
                  <View style = {{position: 'absolute', backgroundColor: 'white', flex: 1, flexDirection: 'row', bottom: 120, left: 0, right: 0, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.selectPhotoTapped()}>
                      { this.state.avatarSource === null ?
                        <Image source = {camera}></Image> :
                        <Image source={this.state.avatarSource} style={{width:280, height: 280}} />
                      }
                    </TouchableOpacity>
                  </View>
                  <View style = {{position: 'absolute', backgroundColor: 'white', flex: 1, flexDirection: 'row', bottom: 0, left: 0, right: 0, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                      <Button style = {[gStyle.button, {backgroundColor: 'black', flex: 0.7}]}
                      textStyle = {{color: 'white'}}
                      onPress = {() => this.setState({modal_open: true})}>
                          <Text style = {{fontFamily: '28 Days Later', fontSize: 15, color: 'white'}}>Post Comment</Text>
                      </Button>
                  </View>

                </View>
                
                <Modal
                    offset = {0}
                    open = {this.state.modal_open}
                    modalDidOpen = {() => console.log('modal did open')}
                    modalDidClose = {() => this.setState({modal_open: false})}
                    style = {{alignItems: 'center'}}>
                    <View style = {{backgroundColor: '#2d2d2d', paddingTop: 20}}>
                        <View style = {gStyle.textInput}>
                        <TextInput
                            style = {{color: 'white', height: 40, margin: 10, textAlign: 'center'}}
                            placeholder = "Name of Image?"
                            placeholderTextColor = "gray"
                            onChangeText = {(text) => this.setState({ imageName: text })}
                            value = {this.state.imageName}
                        />
                        </View>
                        <View>
                            <Button style = {gStyle.button}
                            textStyle = {{color: 'white'}}
                            onPress = {() => this.post()}>
                            Post Now
                            </Button>
                        </View>
                    </View>
                </Modal>
      </View>
    );
  }

  postImage() {
    // <TabViewAnimated
    //               style = {gStyle.container}
    //               navigationState = {this.state.navigationState}
    //               renderScene = {({ route }) => {
    //                 switch (route.key) {
    //                 case '1':
    //                   return (
    //                       <View style = {[ gStyle.PageView, { backgroundColor: '#3d3d3d' } ]}>
    //                         <View style = {{flex: 1, margin: 20, alignItems: 'center', justifyContent: 'center'}}>
    //                           <TouchableOpacity onPress = {() => this.selectPhotoTapped()}>
    //                             { this.state.avatarSource === null ?
    //                               <Image source = {camera}></Image> :
    //                               <Image source={this.state.avatarSource} style={{width:280, height: 280}} />
    //                             }
    //                           </TouchableOpacity>
    //                         </View>
    //                       </View>
    //                   );

    //                 case '2':
    //                   return (
    //                       <View style={[ gStyle.PageView, { backgroundColor: '#3d3d3d' } ]}>
    //                         <View style = {{flex: 1, flexDirection: 'column'}}>
    //                           <TextInput
    //                             style = {{flex: 1, margin: 20, borderWidth: 3, borderColor: 'white', fontSize: 18, padding: 15, color: 'white', textAlignVertical: 'top'}}
    //                             placeholder = "Input your comment here..."
    //                             placeholderTextColor = 'gray'
    //                             onChangeText = {(text) => this.setState({ comment: text })}
    //                             multiline = {true}
    //                             editable = {true}
    //                             maxLength = {1024}
    //                           />
    //                         </View>
    //                       </View>
    //                   );
    //                 default:
    //                   return null;
    //                 }
    //               }}
    //               renderHeader = {this._renderHeader}
    //               onRequestChangeTab = {this._handleChangeTab}
    //             />
    if(!this.state.imageSelected){
      alert("Image unselected!");
    }
    else if(this.state.comment.replace(/ /g, "").replace(/\n/g, "").length == 0){
      alert("Your comment is empty!");
    }
    else{
      this.setState({modal_open: true});
    }
    
  }

  post() {
      if(this.state.imageName.length == 0){
        alert("The name is empty!");
        return;
      }
      
      let rnfbURI = RNFetchBlob.wrap(this.state.imageUrl);
      let filename = this.state.imageName + '-Mickey2015-' + Model.getDate() + '.jpg';
      // create Blob from file path
      Blob.build(rnfbURI, { type : 'image/jpg;'})
      .then((blob) => {
        // upload image using Firebase SDK
        this.setState({rButtonText: 'Uploading...'});
        this.setState({uploading: true})
        return firebase.storage()
          .ref('rn-firebase-upload')
          .child(filename)
          .put(blob, { contentType : 'image/jpg' })
          .then((snapshot) => {
            alert('Uploaded successfully!');            
            this.setState({modal_open: false});
            this.setState({rButtonText: 'Upload'});
            this.setState({uploading: false})
            this.addToGameList(filename);
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