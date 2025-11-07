import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { toast, showSuccess, showError, showWarning } = useToast();
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      if (!token || !userId || userId === 'undefined' || userId === 'null') {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      const response = await fetch('http://localhost:5000/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        setEditedProfile(data.user);
      } else {
        showError('Failed to fetch profile: ' + data.message);
      }
    } catch (error) {
      showError('Error fetching profile. Please login again.');
      localStorage.clear();
      window.location.href = '/login';
    }
  };



  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(editedProfile),
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        setIsEditing(false);
        showSuccess('Profile updated successfully!');
      } else {
        showError('Failed to update profile: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Error updating profile.');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showWarning('New passwords do not match!');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showSuccess('Password updated successfully!');
      } else {
        showError('Failed to update password: ' + data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showError('Error changing password.');
    }
  };

  if (!profile) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Profile</h2>
        </div>
        <div className="profile-body">
          {!isEditing ? (
            <>
              <div className="profile-info">
                <div className="profile-field">
                  <div className="profile-field-label">Name</div>
                  <div className="profile-field-value">{profile.name}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Email</div>
                  <div className="profile-field-value">{profile.email}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Role</div>
                  <div className="profile-field-value">{profile.role?.name || profile.role}</div>
                </div>
              </div>
              <div className="profile-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="btn btn-success"
                >
                  Change Password
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="profile-actions">
                <button
                  onClick={handleUpdateProfile}
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(profile);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal para cambiar contraseña */}
      {isChangingPassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Change Password</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button
                  onClick={handlePasswordChange}
                  className="btn btn-success"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </div>
  );
}

export default Profile;