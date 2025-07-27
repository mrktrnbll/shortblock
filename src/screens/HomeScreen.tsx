import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  Alert, 
  ActivityIndicator,
  NativeModules,
  Platform 
} from 'react-native';

const { VpnModule } = NativeModules;

export default function HomeScreen() {
  const [isVpnEnabled, setIsVpnEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vpnStatus, setVpnStatus] = useState('Disconnected');

  useEffect(() => {
    checkVpnStatus();
    
    const interval = setInterval(checkVpnStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkVpnStatus = async () => {
    try {
      const status = await VpnModule.getVpnStatus();
      setIsVpnEnabled(status);
      setVpnStatus(status ? 'Connected' : 'Disconnected');
    } catch (error) {
      console.log('Error checking VPN status:', error);
    }
  };

  const handleVpnToggle = async (value) => {
    setIsLoading(true);
    console.log(value)
    try {
      if (value) {
        if (Platform.OS === 'android') {
          const prepareResult = await VpnModule.prepareVpn();
          console.log("android")
          if (prepareResult === 'preparation_required') {
            console.log(prepareResult)
            Alert.alert(
              'VPN Permission',
              'Please allow VPN access in the next screen',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => setIsLoading(false)
                },
                {
                  text: 'Continue',
                  onPress: async () => {
                    try {
                      await VpnModule.startVpn();
                      setIsVpnEnabled(true);
                      setVpnStatus('Connected');
                      console.log("connected")
                    } catch (error) {
                      console.log('Error', 'Failed to start VPN: ' + error.message);
                      setIsVpnEnabled(false);
                    }
                    setIsLoading(false);
                  }
                }
              ]
            );
          }
        }
        
        console.log("starting")
        await VpnModule.startVpn();
        setIsVpnEnabled(true);
        setVpnStatus('Connected');
        
        Alert.alert(
          'Content Filter Active',
          'Short-form content will now be blocked across apps.',
          [{ text: 'OK' }]
        );
        
      } else {
        await VpnModule.stopVpn();
        setIsVpnEnabled(false);
        setVpnStatus('Disconnected');
        
        Alert.alert(
          'Content Filter Disabled',
          'Short-form content blocking has been turned off.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to ${value ? 'start' : 'stop'} VPN: ${error.message}`
      );
      console.log("error")
      console.log(error + "    here")
      setIsVpnEnabled(!value);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (vpnStatus) {
      case 'Connected':
        return '#4CAF50';
      case 'Connecting':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Filter</Text>
        <Text style={styles.subtitle}>
          Block short-form content across all apps
        </Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {vpnStatus}
          </Text>
        </View>
        
        <Text style={styles.statusDescription}>
          {isVpnEnabled 
            ? 'Your traffic is being filtered. Short-form content from Instagram, YouTube, and TikTok will be blocked.'
            : 'Content filtering is disabled. All content will load normally.'
          }
        </Text>
      </View>

      <View style={styles.toggleCard}>
        <View style={styles.toggleHeader}>
          <Text style={styles.toggleTitle}>Enable Content Filter</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#164349ff" />
          ) : (
            <Switch
              value={isVpnEnabled}
              onValueChange={handleVpnToggle}
              trackColor={{ false: '#767577', true: '#9dced49f' }}
              thumbColor={isVpnEnabled ? '#164349ff' : '#f4f3f4'}
              disabled={isLoading}
            />
          )}
        </View>
        
        <Text style={styles.toggleDescription}>
          This will create a VPN connection to filter out distracting short-form content
        </Text>
      </View>

      <View style={styles.blockedContent}>
        <Text style={styles.blockedTitle}>Blocked Content Types:</Text>
        <Text style={styles.blockedItem}>• Instagram Reels & Stories</Text>
        <Text style={styles.blockedItem}>• YouTube Shorts</Text>
        <Text style={styles.blockedItem}>• TikTok (entire app)</Text>
        <Text style={styles.blockedItem}>• Other short-form video content</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#164349ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  toggleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  blockedContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blockedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  blockedItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 5,
  },
});
