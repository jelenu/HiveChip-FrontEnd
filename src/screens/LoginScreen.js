import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { HandleLogin } from '../api/auth';
import { AuthContext } from '../context/AuthContext'; // * Import authentication context

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext); // * Use login method from context

  const handleSubmit = async () => {
    if (!username || !password) {
      return setErrorMsg('Please fill in all fields.'); // ! Show error if fields are empty
    }

    setLoading(true);
    setErrorMsg(''); // * Clear error message before making the request

    try {
      console.log('Attempting login with username:', username); // * Debug login attempt
      const response = await HandleLogin(username, password);
      if (response) {
        console.log('Login successful'); // * Debug successful login
        await login(response.access, response.refresh); // * Save tokens and update state
      }
    } catch (error) {
      console.error('Login failed:', error); // ! Handle login errors
      setErrorMsg(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // * Stop loading spinner
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text> {/* * Login title */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null} {/* ! Display error message */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit} disabled={loading} /> {/* * Login button */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});