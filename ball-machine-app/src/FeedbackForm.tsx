import React, { useState } from 'react';

interface FeedbackData {
  problemDescription: string;
  contactEmail: string;
  deviceData: File | null;
}

export function FeedbackForm({ onBack }: { onBack: () => void }) {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    problemDescription: '',
    contactEmail: '',
    deviceData: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadStage, setUploadStage] = useState<'idle' | 'connecting' | 'transferring' | 'transferred' | 'uploading' | 'completed'>('idle');
  const [showNetworkSwitchModal, setShowNetworkSwitchModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (field: keyof FeedbackData, value: string | File) => {
    setFeedbackData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnectAndUpload = async () => {
    setIsConnecting(true);
    setUploadStage('connecting');
    setUploadStatus('正在自动连接设备Wi-Fi...');

    // 模拟自动连接设备Wi-Fi
    setTimeout(() => {
      setUploadStatus('设备连接成功，正在传输数据...');
      setUploadStage('transferring');

      setTimeout(() => {
        setUploadStatus('设备数据传输完成！');
        setUploadStage('transferred');
        setIsConnecting(false);

        // 显示网络切换提示
        setShowNetworkSwitchModal(true);
      }, 3000);
    }, 2000);
  };

  const handleNetworkSwitchAndUpload = async () => {
    setShowNetworkSwitchModal(false);
    setUploadStatus('正在检测网络连接...');
    setUploadStage('uploading');

    setTimeout(() => {
      setUploadStatus('数据已上传到服务器！');
      setUploadStage('completed');
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackData.problemDescription.trim() || !feedbackData.contactEmail.trim()) {
      alert('请填写问题描述和联系邮箱');
      return;
    }

    setIsSubmitting(true);

    // 模拟提交过程
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟成功提交
      setShowSuccessModal(true);

      // 重置表单
      setFeedbackData({
        problemDescription: '',
        contactEmail: '',
        deviceData: null
      });
      setUploadStatus('');
      setUploadStage('idle');

    } catch (error) {
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5a3d 50%, #1a4d2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '550px', margin: '0 auto', padding: '0 8px' }}>
        {/* 顶部导航栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '0 8px'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            ← 返回
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            用户反馈
          </h1>
          <div style={{ width: '80px' }}></div>
        </div>

        {/* 反馈表单 */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1a4d2e',
            marginBottom: '32px',
            textAlign: 'center'
          }}>您的宝贵反馈</h2>

          <form onSubmit={handleSubmit}>
            {/* 问题描述 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                问题描述:
              </label>
              <textarea
                value={feedbackData.problemDescription}
                onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                rows={8}
                placeholder="请详细描述您遇到的问题，例如：设备型号、出现问题的场景、具体错误提示等。"
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  backgroundColor: '#f8fafc',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {/* 联系邮箱 */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                联系邮箱:
              </label>
              <input
                type="email"
                value={feedbackData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="请输入您的邮箱地址，以便我们与您联系。"
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  backgroundColor: '#f8fafc',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {/* 设备数据上传 */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '16px'
              }}>
                上传设备数据:
              </label>

              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '16px', fontWeight: '500' }}>
                  设备数据上传流程：
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: uploadStage === 'connecting' ? '#d97706' : uploadStage !== 'idle' ? '#059669' : '#64748b'
                  }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: uploadStage === 'connecting' ? '#d97706' : uploadStage !== 'idle' ? '#059669' : '#e5e7eb',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '8px'
                    }}>
                      {uploadStage !== 'idle' ? '✓' : '1'}
                    </span>
                    自动连接设备Wi-Fi
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: uploadStage === 'transferring' || uploadStage === 'transferred' || uploadStage === 'uploading' || uploadStage === 'completed' ? '#d97706' : uploadStage === 'idle' ? '#64748b' : '#059669'
                  }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: uploadStage === 'transferring' || uploadStage === 'transferred' || uploadStage === 'uploading' || uploadStage === 'completed' ? '#d97706' : uploadStage === 'idle' ? '#e5e7eb' : '#059669',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '8px'
                    }}>
                      {uploadStage === 'transferring' || uploadStage === 'transferred' || uploadStage === 'uploading' || uploadStage === 'completed' ? '✓' : '2'}
                    </span>
                    从设备传输数据到APP
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: uploadStage === 'uploading' || uploadStage === 'completed' ? '#d97706' : '#64748b'
                  }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: uploadStage === 'uploading' || uploadStage === 'completed' ? '#d97706' : '#e5e7eb',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '8px'
                    }}>
                      {uploadStage === 'uploading' || uploadStage === 'completed' ? '✓' : '3'}
                    </span>
                    切换回个人网络上传到服务器
                  </div>
                </div>
                {uploadStatus && (
                  <p style={{
                    fontSize: '13px',
                    color: uploadStage === 'completed' ? '#059669' : '#d97706',
                    fontWeight: '500',
                    margin: '16px 0 0 0',
                    textAlign: 'center'
                  }}>
                    {uploadStatus}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleConnectAndUpload}
                disabled={isConnecting || uploadStage === 'transferred' || uploadStage === 'uploading' || uploadStage === 'completed'}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  background: isConnecting || uploadStage === 'transferred' || uploadStage === 'uploading' || uploadStage === 'completed'
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: isConnecting || uploadStage === 'transferred' || uploadStage === 'uploading' || uploadStage === 'completed' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isConnecting || uploadStage === 'transferred' || uploadStage === 'uploading' || uploadStage === 'completed'
                    ? '0 4px 12px rgba(156, 163, 175, 0.3)'
                    : '0 4px 16px rgba(59, 130, 246, 0.3)',
                  marginBottom: '16px'
                }}
              >
                {isConnecting ? '连接中...' : uploadStage === 'transferred' ? '等待网络切换' : uploadStage === 'uploading' ? '正在上传到服务器' : uploadStage === 'completed' ? '上传完成' : '连接设备并上传数据'}
              </button>

              {uploadStage === 'completed' && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#15803d',
                  fontWeight: '500'
                }}>
                  设备数据已成功上传到服务器
                </div>
              )}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '16px',
                background: isSubmitting
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isSubmitting
                  ? '0 4px 12px rgba(156, 163, 175, 0.3)'
                  : '0 6px 20px rgba(34, 197, 94, 0.4)'
              }}
            >
              {isSubmitting ? '提交中...' : '提交反馈'}
            </button>
          </form>
        </div>
      </div>

      {/* 网络切换提示弹窗 */}
      {showNetworkSwitchModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fef3c7',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 24px auto'
            }}>
              <span style={{ fontSize: '40px', color: '#d97706' }}>📶</span>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a4d2e',
              marginBottom: '12px'
            }}>
              需要切换网络
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              lineHeight: '1.5',
              marginBottom: '24px'
            }}>
              设备数据已传输完成！现在请切换回您自己的Wi-Fi网络，然后点击下方按钮将数据上传到服务器。
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowNetworkSwitchModal(false)}
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  background: '#e5e7eb',
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                稍后再说
              </button>
              <button
                onClick={handleNetworkSwitchAndUpload}
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
                }}
              >
                已切换网络，开始上传
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示弹窗 */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 24px auto'
            }}>
              <span style={{ fontSize: '40px', color: '#22c55e' }}>✓</span>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a4d2e',
              marginBottom: '12px'
            }}>
              反馈提交成功！
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              lineHeight: '1.5',
              marginBottom: '24px'
            }}>
              感谢您的反馈，我们会尽快处理并与您联系。
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
              }}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}