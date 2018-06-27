const React = require('react');
const ReactNative = require('react-native');
import {Actions} from 'react-native-router-flux'
import NavigationBar from 'react-native-navbar';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';
import ImageZoom from 'react-native-image-pan-zoom';

const {
  View,
  Dimensions,
  StyleSheet
} = ReactNative;
const { width, height } = Dimensions.get('window');


class Preview extends React.Component {
  
  constructor(props) {
    super(props);  
    this.state = { 
        img: props.img,
        imageWidth: width,
        imageHeight: height,
    };
    
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
    const titleConfig = {
        title: 'Preview',
        tintColor: 'yellow',
        style: {
            fontSize: 20,
            fontFamily: '28 Days Later'
        }
    };
    return (
        <View style = {{flex: 1, backgroundColor: '#1d1d1d'}}>
            <NavigationBar
                    style = {{backgroundColor: '#1d1d1d', marginTop: -20, height:80, borderColor: 'yellow', borderBottomWidth: 0.5}}
                    leftButton = {leftButtonConfig}
                    title = {titleConfig}
            />
            <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ImageZoom cropWidth={Dimensions.get('window').width - 40}
                        cropHeight={Dimensions.get('window').height - 120}
                        imageWidth={Dimensions.get('window').width - 40}
                        imageHeight={Dimensions.get('window').height - 120}>
                <Image style={{width:Dimensions.get('window').width - 40, height:Dimensions.get('window').height - 120, resizeMode: 'contain'}} source={this.state.img}/>
            </ImageZoom>
            </View>
        </View>

    )
  }


}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  flex: {
    flex: 1,
  },
  maskContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  mask: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    overflow: 'hidden',
  },
  topBottom: {
    height: 50,
    width: width - 100,
    left: 50,
  },
  top: {
    top: 0,
  },
  bottom: {
    top: width - 50,
  },
  side: {
    width: 50,
    height: width,
    top: 0,
  },
  left: {
    left: 0,
  },
  right: {
    left: width - 50,
  },
});

module.exports = Preview;