import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import Chatbot from '../assets/chatbot_icon.svg';
import Notification from '../assets/notification_icon.svg';
import Analytics from '../assets/analytics_icon.svg';
import Files from '../assets/files_icon.svg';
import Settings from '../assets/settings_icon.svg';
import { useNavigate } from 'react-router-dom';
function Contacts() {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const userDataString = localStorage.getItem('chat-app-user');
      if (userDataString) {
        try {
          const data = JSON.parse(userDataString);
          setCurrentUserName(data.username);
          setCurrentUserImage(data.avatarImage);
        } catch (error) {
          // Handle error if parsing fails
          console.error('Error parsing user data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const chatbotreset = () => {
    navigate('/');
  };

  const postSubmit = () => {
    navigate('/postlist');
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h2>Lawydot</h2>
          </div>
          <div className="contacts">
            <div className="contact" onClick={chatbotreset}>
              <div className="sidebar-icon">
                <img src={Chatbot} alt="chatbot" />
                <h3>Chatbot</h3>
              </div>
            </div>
            <div className="contact">
              <div className="sidebar-icon">
                <img src={Notification} alt="notification" />
                <h3>Notification</h3>
              </div>
            </div>
            <div className="contact" onClick={postSubmit}>
              <div className="sidebar-icon">
                <img src={Analytics} alt="analytics" />
                <h3>Analytics</h3>
              </div>
            </div>
            <div className="contact">
              <div className="sidebar-icon">
                <img src={Files} alt="files" />
                <h3>Files</h3>
              </div>
            </div>
            <div className="contact">
              <div className="sidebar-icon">
                <img src={Settings} alt="settings" />
                <h3>Settings</h3>
              </div>
            </div>
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 20% 65% 15%;
  overflow: hidden;
  background-color: #f8f8f8;
  margin: 15px;
  border-radius: 15px;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h2 {
      color: #1a18b8;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.5rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 3.5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .sidebar-icon {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
          margin-left: 20px;
          height: 2rem;
        }
        h3 {
          color: black;
          text-transform: uppercase;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #5374e6;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 3rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;
