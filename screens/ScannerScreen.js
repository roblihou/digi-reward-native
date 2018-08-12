import React from 'react';
import { Modal, TouchableHighlight, Image, Button, StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

const ValidCode = (props) => (
  <View style={{
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Image source={require('../assets/images/check.gif')}/>
    <Text>Reward successfully redeemed!</Text>
  </View>
);

const InvalidCode = (props) => (
  <View style={{
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Image source={require('../assets/images/stop.png')} style={{alignItems: 'center', width: 120, height:120}}/>
    <Text>Unable to redeem reward.</Text>
    <Text>{props.reason}</Text>
  </View>
);




export default class ScannerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      valid: false,
      reason: 'expired code',
    };
  }

  static navigationOptions = {
    title: 'Scan Rewards 1',
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  }

  render() {
    const { hasCameraPermission, reason, scanned, valid } = this.state;

    if(scanned){
      let displayResult;
      if(valid){
        displayResult = <ValidCode/>
      }
      else{
        displayResult = <InvalidCode reason={reason}/>
      }
      return(
        <Modal
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            this.setState({
              scanned: false,
              valid: false,
            });
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <TouchableHighlight
                onPress={() => {
                  this.setState({
                    scanned: false,
                    valid: false,
                  });
                }}  
              >
                {displayResult}
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      );
    } else{
      if (hasCameraPermission === null) {
        return <Text>Requesting for camera permission</Text>;
      } else if (hasCameraPermission === false) {
        return <Text>No access to camera. Please go to your phone settings and enable camera access for this app.</Text>;
      } else {
        return (
          <View style={{ flex: 1 }}>
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={StyleSheet.absoluteFill}
            />
          </View>
        );
      }
    }
  }

  _handleBarCodeRead = ({ type, data }) => {
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    // call to DB here - check code against database
    if(data === '12345'){
      //alert('redeemed!');
      this.setState({
        scanned: true,
        valid: true,
      });
    }
    else{
      //alert('Not valid.');
      this.setState({
        scanned: true,
        valid: false,
      });
    }
  }
}


const styles = StyleSheet.create({
  image: {
    alignItems: 'center',
    width: 80,
  },
});
