import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import welcomeimg from '../assets/welcome.gif';

function Welcometothe() {
  const [userName, setUserName] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('chat-app-user');
      if (storedUser) {
        setUserName(JSON.parse(storedUser).username);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Container>
      <img src={welcomeimg} alt="" />
      <br />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <br />
      <h3>Please tell us the circumstances in which you need our legal services!</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  img {
    height: 30rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcometothe;
