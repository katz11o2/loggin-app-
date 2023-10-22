import React, { Component } from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import PhoneCall from 'react-native-phone-call'; // Import the PhoneCall component

class VibrationDetectorApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      monitoring: false,
      countdown: 0,
    };

    this.threshold = 5; // Set the threshold to 5
    this.phoneNumber = '9535015701'; // Specify the phone number without 'tel:'
    this.countdownDuration = 5; // Countdown duration in seconds

    this.accelerometerSubscription = null;
    this.countdownTimer = null;
  }

  componentDidMount() {
    // Start monitoring when the component is mounted
    this.startMonitoring();
  }

  componentWillUnmount() {
    // Stop monitoring and the countdown timer when the component is unmounted
    this.stopMonitoring();
  }

  startMonitoring() {
    this.accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      if (acceleration > this.threshold) {
        this.startCountdown();
      }
    });

    this.setState({ monitoring: true });
  }

  stopMonitoring() {
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove();
    }
    this.setState({ monitoring: false });

    // Clear the countdown timer if it's active
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);
      this.countdownTimer = null;
      this.setState({ countdown: 0 });
    }
  }

  startCountdown() {
    this.setState({ countdown: this.countdownDuration });
    this.countdownTimer = setTimeout(() => {
      this.makeEmergencyCall();
      this.setState({ countdown: 0 });
    }, this.countdownDuration * 1000);
  }

  makeEmergencyCall() {
    const args = {
      number: this.phoneNumber,
      prompt: false,
    };
    PhoneCall(args);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.monitoring ? 'Monitoring Enabled' : 'Monitoring Disabled'}</Text>
        {this.state.countdown > 0 && (
          <Text style={styles.countdownText}>Countdown: {this.state.countdown}</Text>
        )}
        <Button
          title={this.state.monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          onPress={() => {
            if (this.state.monitoring) {
              this.stopMonitoring();
            } else {
              this.startMonitoring();
            }
          }}
        />
        <TouchableOpacity
          style={styles.accidentButton}
          onPress={() => this.startCountdown()}
        >
          <Text style={styles.buttonText}>Accident</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accidentButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  countdownText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default VibrationDetectorApp;
