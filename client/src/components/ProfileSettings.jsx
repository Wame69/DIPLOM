// components/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function ProfileSettings({ onClose, user, onSave, onAvatarUpload }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [avatar, setAvatar] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const translations = {
    ru: {
      profileSettings: 'Настройки профиля',
      name: 'Имя',
      enterName: 'Введите ваше имя',
      email: 'Email',
      enterEmail: 'Введите ваш email',
      phone: 'Телефон',
      enterPhone: 'Введите ваш телефон',
      bio: 'О себе',
      enterBio: 'Расскажите о себе...',
      security: 'Безопасность',
      changePassword: 'Сменить пароль',
      twoFactorAuth: 'Двухфакторная аутентификация',
      cancel: 'Отмена',
      saveChanges: 'Сохранить изменения',
      changePhoto: 'Изменить фото'
    },
    en: {
      profileSettings: 'Profile Settings',
      name: 'Name',
      enterName: 'Enter your name',
      email: 'Email',
      enterEmail: 'Enter your email',
      phone: 'Phone',
      enterPhone: 'Enter your phone',
      bio: 'About',
      enterBio: 'Tell about yourself...',
      security: 'Security',
      changePassword: 'Change Password',
      twoFactorAuth: 'Two-Factor Authentication',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      changePhoto: 'Change Photo'
    }
  };

  const t = translations[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      avatar: avatar
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onAvatarUpload(event);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    alert('Функция смены пароля в разработке');
  };

  const handleTwoFactorAuth = () => {
    alert('Функция двухфакторной аутентификации в разработке');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.profileSettings}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="profile-content">
            <div className="avatar-section">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <div className="avatar-circle">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" />
                    ) : (
                      <span>{form.name[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="avatar-overlay">
                    <span>📷</span>
                    <span className="upload-text">{t.changePhoto}</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="avatar-input" 
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-group">
                <label>{t.name}</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder={t.enterName}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>{t.email}</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder={t.enterEmail}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>{t.phone}</label>
                <input 
                  type="tel" 
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  placeholder={t.enterPhone}
                />
              </div>
              
              <div className="form-group">
                <label>{t.bio}</label>
                <textarea 
                  value={form.bio}
                  onChange={(e) => setForm({...form, bio: e.target.value})}
                  placeholder={t.enterBio}
                  rows="4"
                />
              </div>

              <div className="security-section">
                <h3>{t.security}</h3>
                <button type="button" className="btn-outline" onClick={handleChangePassword}>
                  {t.changePassword}
                </button>
                <button type="button" className="btn-outline" onClick={handleTwoFactorAuth}>
                  {t.twoFactorAuth}
                </button>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="btn-primary">
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content.large {
          width: 600px;
          max-width: 90vw;
          max-height: 90vh;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #1a365d;
          font-size: 24px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        
        .close-btn:hover {
          background: rgba(0,0,0,0.05);
        }
        
        .profile-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        
        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }
        
        .avatar-upload {
          position: relative;
          cursor: pointer;
          text-align: center;
        }
        
        .avatar-preview {
          position: relative;
          display: inline-block;
        }
        
        .avatar-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a365d, #2d3748);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: white;
          font-weight: 600;
          overflow: hidden;
        }
        
        .avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          color: white;
        }
        
        .avatar-upload:hover .avatar-overlay {
          opacity: 1;
        }
        
        .upload-text {
          font-size: 12px;
          margin-top: 4px;
        }
        
        .avatar-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-weight: 600;
          color: #1a365d;
          font-size: 14px;
        }
        
        .form-group input,
        .form-group textarea {
          padding: 12px 16px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: #f7fafc;
          color: #2d3748;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1a365d;
          box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
        }
        
        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #a0aec0;
        }
        
        .security-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
        }
        
        .security-section h3 {
          margin: 0 0 16px 0;
          color: #1a365d;
          font-size: 16px;
        }
        
        .btn-outline {
          padding: 12px 20px;
          border: 2px solid #1a365d;
          background: transparent;
          color: #1a365d;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          width: 100%;
          font-size: 14px;
        }
        
        .btn-outline:hover {
          background: #1a365d;
          color: white;
          transform: translateY(-1px);
        }
        
        .modal-actions {
          padding: 20px 24px;
          border-top: 1px solid rgba(0,0,0,0.1);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 54, 93, 0.3);
        }
        
        .btn-secondary {
          background: rgba(0,0,0,0.05);
          color: #333;
        }
        
        .btn-secondary:hover {
          background: rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .modal-content.large {
            width: 95vw;
          }
          
          .profile-content {
            padding: 16px;
          }
          
          .avatar-circle {
            width: 80px;
            height: 80px;
            font-size: 32px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}