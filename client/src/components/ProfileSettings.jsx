// components/ProfileSettings.jsx
import React, { useState } from 'react';

export default function ProfileSettings({ onClose }) {
  const [user, setUser] = useState({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    avatar: null
  });

  const handleSave = () => {
    // Сохранение данных профиля
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Настройки профиля</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-content">
          <div className="avatar-section">
            <div className="avatar-upload">
              <div className="avatar-preview">
                <div className="avatar-circle">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" />
                  ) : (
                    <span>{user.name[0]}</span>
                  )}
                </div>
                <div className="avatar-overlay">
                  <span>📷</span>
                </div>
              </div>
              <input type="file" accept="image/*" className="avatar-input" />
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-group">
              <label>Имя</label>
              <input 
                type="text" 
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                placeholder="Введите ваше имя"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="Введите ваш email"
              />
            </div>
            
            <div className="form-group">
              <label>Телефон</label>
              <input 
                type="tel" 
                value={user.phone}
                onChange={(e) => setUser({...user, phone: e.target.value})}
                placeholder="Введите ваш телефон"
              />
            </div>
            
            <div className="form-group">
              <label>О себе</label>
              <textarea 
                placeholder="Расскажите о себе..."
                rows="4"
              />
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Отмена</button>
          <button className="btn-primary" onClick={handleSave}>Сохранить изменения</button>
        </div>
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
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 0;
          max-height: 80vh;
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
          color: #333;
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
        }
        
        .avatar-preview {
          position: relative;
        }
        
        .avatar-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
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
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .avatar-upload:hover .avatar-overlay {
          opacity: 1;
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
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }
        
        .form-group input,
        .form-group textarea {
          padding: 12px 16px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
          background: rgba(0,0,0,0.05);
          color: #333;
        }
        
        .btn-secondary:hover {
          background: rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}