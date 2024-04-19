import React from 'react';
import { useNavigate } from 'react-router-dom';
import './recipes.css';
import { Button } from '@mui/material';

const Profile = ({ user, profilePic, name }) => {
  const navigate = useNavigate();
  return (
    <>
      {user ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '5%',
          }}
        >
          <h1 style={{ color: 'grey' }}>Your Profile</h1>
          <img
            src={profilePic}
            style={{ width: '25%', borderRadius: '50%' }}
          />{' '}
          <Button
            onClick={() => navigate('/settings')}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: '5px',
              padding: '7px',
              border: 'none',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#000',
              },
            }}
          >
            Change your Profile Picture
          </Button>
          <h4 style={{ margin: '2%' }}>Username: {name}</h4>
          <h4
            onClick={() => {
              console.log(JSON.stringify(user));
            }}
          >
            Registered Email: {user.email}
          </h4>
        </div>
      ) : (
        'Please login or create an account to view this page.'
      )}
    </>
  );
};

export default Profile;
