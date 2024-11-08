import React, { useEffect } from 'react';
import * as AuthApi from "../api/AuthApi";

const TestIP = () => {
  const sendCustomerIp = async () => {
    try {
      const result = await AuthApi.signIn(); // No need for response.json() here
      console.log('Response from Node.js:', result); // Logs the response from the server
    } catch (error) {
      console.error('Error sending IP:', error);
    }
  };

  useEffect(() => {
    sendCustomerIp();
  }, []);

  return (
    <div>
      <h1>React Application</h1>
    </div>
  );
};

export default TestIP;
