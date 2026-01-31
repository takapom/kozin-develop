import React, { useState, useEffect } from 'react';

// ========================================
// PlanLike - iPhone UI Design System
// 「みんなの『好き』を、AIがひとつの物語にする。」
// ========================================

// Design Tokens
const tokens = {
  colors: {
    primary: '#FF6B9D',      // Playful Pink
    secondary: '#7C5CFF',    // Creative Purple
    accent: '#00D4AA',       // Fresh Mint
    warning: '#FFB347',      // Warm Orange
    background: '#FAFBFF',   // Soft White
    surface: '#FFFFFF',
    surfaceAlt: '#F5F7FF',
    text: '#1A1D29',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    gradient1: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E72 50%, #FFB347 100%)',
    gradient2: 'linear-gradient(135deg, #7C5CFF 0%, #00D4AA 100%)',
    gradient3: 'linear-gradient(180deg, #FAFBFF 0%, #F0F4FF 100%)',
  },
  shadows: {
    soft: '0 4px 20px rgba(124, 92, 255, 0.08)',
    medium: '0 8px 32px rgba(124, 92, 255, 0.12)',
    glow: '0 0 40px rgba(255, 107, 157, 0.3)',
  },
  radius: {
    sm: '12px',
    md: '20px',
    lg: '28px',
    xl: '36px',
    full: '9999px',
  }
};

// Shared Styles
const baseStyles = {
  container: {
    width: '393px',
    height: '852px',
    background: tokens.colors.background,
    borderRadius: '48px',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: "'SF Pro Display', -apple-system, sans-serif",
    boxShadow: '0 50px 100px rgba(0,0,0,0.15)',
  },
  statusBar: {
    height: '54px',
    padding: '14px 28px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: '600',
  },
  safeArea: {
    padding: '0 24px',
    paddingBottom: '34px',
  },
  homeIndicator: {
    width: '134px',
    height: '5px',
    background: tokens.colors.text,
    borderRadius: '3px',
    margin: '0 auto',
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    opacity: 0.2,
  }
};

// ========================================
// Screen 1: Splash / Onboarding
// ========================================
const SplashScreen = () => (
  <div style={{
    ...baseStyles.container,
    background: tokens.colors.gradient1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Floating Shapes */}
    <div style={{
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      top: '-100px',
      right: '-80px',
      animation: 'float 6s ease-in-out infinite',
    }}/>
    <div style={{
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
      bottom: '100px',
      left: '-60px',
      animation: 'float 8s ease-in-out infinite reverse',
    }}/>
    
    {/* Logo */}
    <div style={{
      width: '120px',
      height: '120px',
      background: 'white',
      borderRadius: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      marginBottom: '32px',
    }}>
      <span style={{ fontSize: '56px' }}>💫</span>
    </div>
    
    {/* App Name */}
    <h1 style={{
      fontSize: '42px',
      fontWeight: '800',
      color: 'white',
      margin: '0 0 12px',
      letterSpacing: '-1px',
    }}>
      PlanLike
    </h1>
    
    {/* Tagline */}
    <p style={{
      fontSize: '17px',
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
      margin: 0,
      lineHeight: 1.5,
      maxWidth: '260px',
    }}>
      みんなの「好き」を、<br/>
      AIがひとつの物語にする。
    </p>
    
    {/* Get Started Button */}
    <button style={{
      position: 'absolute',
      bottom: '100px',
      background: 'white',
      color: tokens.colors.primary,
      border: 'none',
      padding: '18px 64px',
      borderRadius: tokens.radius.full,
      fontSize: '17px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    }}>
      はじめる ✨
    </button>
    
    <div style={baseStyles.homeIndicator}/>
    
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `}</style>
  </div>
);

// ========================================
// Screen 2: Login / Signup
// ========================================
const AuthScreen = () => (
  <div style={{
    ...baseStyles.container,
    background: tokens.colors.gradient3,
  }}>
    <div style={baseStyles.statusBar}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span>📶</span><span>📡</span><span>🔋</span>
      </div>
    </div>
    
    <div style={{ ...baseStyles.safeArea, paddingTop: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: tokens.colors.gradient1,
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: tokens.shadows.glow,
        }}>
          <span style={{ fontSize: '36px' }}>💫</span>
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: tokens.colors.text,
          margin: '0 0 8px',
        }}>
          おかえりなさい！
        </h1>
        <p style={{
          fontSize: '15px',
          color: tokens.colors.textSecondary,
          margin: 0,
        }}>
          アカウントにログインしよう
        </p>
      </div>
      
      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'white',
          borderRadius: tokens.radius.md,
          padding: '16px 20px',
          boxShadow: tokens.shadows.soft,
        }}>
          <label style={{
            fontSize: '12px',
            color: tokens.colors.textMuted,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>メールアドレス</label>
          <input 
            type="email" 
            placeholder="your@email.com"
            style={{
              width: '100%',
              border: 'none',
              fontSize: '16px',
              padding: '8px 0 0',
              outline: 'none',
              color: tokens.colors.text,
            }}
          />
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: tokens.radius.md,
          padding: '16px 20px',
          boxShadow: tokens.shadows.soft,
        }}>
          <label style={{
            fontSize: '12px',
            color: tokens.colors.textMuted,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>パスワード</label>
          <input 
            type="password" 
            placeholder="••••••••"
            style={{
              width: '100%',
              border: 'none',
              fontSize: '16px',
              padding: '8px 0 0',
              outline: 'none',
            }}
          />
        </div>
        
        <button style={{
          background: tokens.colors.gradient1,
          color: 'white',
          border: 'none',
          padding: '18px',
          borderRadius: tokens.radius.md,
          fontSize: '17px',
          fontWeight: '700',
          cursor: 'pointer',
          marginTop: '8px',
          boxShadow: tokens.shadows.glow,
        }}>
          ログイン
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '16px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}/>
          <span style={{ fontSize: '13px', color: tokens.colors.textMuted }}>または</span>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}/>
        </div>
        
        <button style={{
          background: 'white',
          color: tokens.colors.text,
          border: '2px solid #E5E7EB',
          padding: '16px',
          borderRadius: tokens.radius.md,
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '20px' }}>🍎</span>
          Appleでサインイン
        </button>
      </div>
      
      {/* Footer */}
      <p style={{
        textAlign: 'center',
        marginTop: '32px',
        fontSize: '15px',
        color: tokens.colors.textSecondary,
      }}>
        アカウントをお持ちでない方は
        <span style={{ 
          color: tokens.colors.primary, 
          fontWeight: '600',
          marginLeft: '4px',
          cursor: 'pointer',
        }}>
          新規登録
        </span>
      </p>
    </div>
    
    <div style={baseStyles.homeIndicator}/>
  </div>
);

// ========================================
// Screen 3: Home (広場一覧)
// ========================================
const HomeScreen = () => (
  <div style={{
    ...baseStyles.container,
    background: tokens.colors.gradient3,
  }}>
    <div style={baseStyles.statusBar}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span>📶</span><span>📡</span><span>🔋</span>
      </div>
    </div>
    
    <div style={{ ...baseStyles.safeArea, paddingTop: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
      }}>
        <div>
          <p style={{
            fontSize: '14px',
            color: tokens.colors.textSecondary,
            margin: '0 0 4px',
          }}>
            おはよう ☀️
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: tokens.colors.text,
            margin: 0,
          }}>
            たかぽん
          </h1>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: tokens.colors.gradient1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: tokens.shadows.soft,
        }}>
          <span style={{ fontSize: '24px' }}>👤</span>
        </div>
      </div>
      
      {/* Quick Action */}
      <button style={{
        width: '100%',
        background: tokens.colors.gradient2,
        border: 'none',
        borderRadius: tokens.radius.lg,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        marginBottom: '28px',
        boxShadow: tokens.shadows.medium,
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '28px' }}>✨</span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{
            color: 'white',
            fontSize: '17px',
            fontWeight: '700',
            margin: '0 0 4px',
          }}>
            新しい広場をつくる
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '13px',
            margin: 0,
          }}>
            友達と「好き」を集めよう
          </p>
        </div>
        <span style={{ 
          marginLeft: 'auto', 
          color: 'white', 
          fontSize: '20px' 
        }}>→</span>
      </button>
      
      {/* Section Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: tokens.colors.text,
          margin: 0,
        }}>
          あなたの広場
        </h2>
        <span style={{
          fontSize: '14px',
          color: tokens.colors.primary,
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          すべて見る
        </span>
      </div>
      
      {/* Hiroba Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { 
            title: '今週末の渋谷🌃', 
            members: ['👩', '👨', '🧑'], 
            posts: 12, 
            color: '#FF6B9D',
            lastActive: '5分前'
          },
          { 
            title: '卒業旅行🎓✈️', 
            members: ['👩', '👨', '🧑', '👩‍🦰'], 
            posts: 28, 
            color: '#7C5CFF',
            lastActive: '2時間前'
          },
          { 
            title: 'カフェ巡り☕', 
            members: ['👩', '🧑'], 
            posts: 8, 
            color: '#00D4AA',
            lastActive: '昨日'
          },
        ].map((hiroba, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: tokens.radius.lg,
            padding: '20px',
            boxShadow: tokens.shadows.soft,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: `linear-gradient(135deg, ${hiroba.color}20, ${hiroba.color}40)`,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: hiroba.color,
                  borderRadius: '50%',
                }}/>
              </div>
              <span style={{
                fontSize: '12px',
                color: tokens.colors.textMuted,
              }}>
                {hiroba.lastActive}
              </span>
            </div>
            
            <h3 style={{
              fontSize: '17px',
              fontWeight: '700',
              color: tokens.colors.text,
              margin: '0 0 8px',
            }}>
              {hiroba.title}
            </h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', marginRight: '8px' }}>
                  {hiroba.members.map((m, j) => (
                    <span key={j} style={{
                      marginLeft: j > 0 ? '-8px' : 0,
                      fontSize: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      padding: '2px',
                    }}>{m}</span>
                  ))}
                </div>
                <span style={{
                  fontSize: '13px',
                  color: tokens.colors.textSecondary,
                }}>
                  {hiroba.members.length}人
                </span>
              </div>
              <div style={{
                background: tokens.colors.surfaceAlt,
                padding: '6px 12px',
                borderRadius: tokens.radius.full,
                fontSize: '13px',
                color: tokens.colors.textSecondary,
              }}>
                📸 {hiroba.posts}件
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Bottom Navigation */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      padding: '12px 40px 34px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTop: '1px solid #F0F0F5',
    }}>
      {[
        { icon: '🏠', label: 'ホーム', active: true },
        { icon: '🔔', label: '通知', active: false },
        { icon: '⚙️', label: '設定', active: false },
      ].map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          opacity: item.active ? 1 : 0.5,
        }}>
          <span style={{ fontSize: '24px' }}>{item.icon}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: item.active ? tokens.colors.primary : tokens.colors.textSecondary,
          }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
    
    <div style={{ ...baseStyles.homeIndicator, bottom: '8px' }}/>
  </div>
);

// ========================================
// Screen 4: 広場詳細 (Hiroba Detail)
// ========================================
const HirobaDetailScreen = () => (
  <div style={{
    ...baseStyles.container,
    background: tokens.colors.gradient3,
  }}>
    <div style={baseStyles.statusBar}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span>📶</span><span>📡</span><span>🔋</span>
      </div>
    </div>
    
    <div style={{ ...baseStyles.safeArea, paddingTop: '10px' }}>
      {/* Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <button style={{
          background: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: tokens.shadows.soft,
        }}>
          <span style={{ fontSize: '18px' }}>←</span>
        </button>
        <h1 style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: '700',
          color: tokens.colors.text,
          margin: 0,
        }}>
          今週末の渋谷🌃
        </h1>
        <button style={{
          background: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: tokens.shadows.soft,
        }}>
          <span style={{ fontSize: '18px' }}>⋯</span>
        </button>
      </div>
      
      {/* Members Preview */}
      <div style={{
        background: 'white',
        borderRadius: tokens.radius.lg,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        boxShadow: tokens.shadows.soft,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex' }}>
            {['👩', '👨', '🧑'].map((m, i) => (
              <span key={i} style={{
                marginLeft: i > 0 ? '-10px' : 0,
                fontSize: '28px',
                background: 'white',
                borderRadius: '50%',
                padding: '2px',
                border: '2px solid white',
              }}>{m}</span>
            ))}
          </div>
          <span style={{
            fontSize: '14px',
            color: tokens.colors.textSecondary,
          }}>
            3人のメンバー
          </span>
        </div>
        <button style={{
          background: tokens.colors.surfaceAlt,
          border: 'none',
          padding: '8px 14px',
          borderRadius: tokens.radius.full,
          fontSize: '13px',
          fontWeight: '600',
          color: tokens.colors.primary,
          cursor: 'pointer',
        }}>
          + 招待
        </button>
      </div>
      
      {/* Posts Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '100px',
      }}>
        {[
          { user: '👩', userName: 'みさき', image: '🍜', caption: '新しいラーメン屋！', likes: 2, time: '5分前' },
          { user: '👨', userName: 'けんた', image: '🌸', caption: '夜桜スポット', likes: 3, time: '12分前' },
          { user: '🧑', userName: 'ゆうき', image: '🎮', caption: 'ゲーセン行きたい', likes: 1, time: '1時間前' },
          { user: '👩', userName: 'みさき', image: '☕', caption: 'このカフェ映える', likes: 2, time: '2時間前' },
          { user: '👨', userName: 'けんた', image: '🛍️', caption: '109の新店舗', likes: 1, time: '昨日' },
          { user: '🧑', userName: 'ゆうき', image: '🍕', caption: 'ピザ食べたい', likes: 2, time: '昨日' },
        ].map((post, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: tokens.radius.md,
            overflow: 'hidden',
            boxShadow: tokens.shadows.soft,
          }}>
            {/* 投稿者情報ヘッダー */}
            <div style={{
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F5F5F5',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ 
                  fontSize: '20px',
                  background: `linear-gradient(135deg, ${['#FFE5EC', '#E5E8FF', '#E5FFF6'][i % 3]}, ${['#FFF0E5', '#F5E5FF', '#E5F5FF'][i % 3]})`,
                  borderRadius: '50%',
                  padding: '2px',
                }}>{post.user}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: tokens.colors.text,
                }}>
                  {post.userName}
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                color: tokens.colors.textMuted,
              }}>
                {post.time}
              </span>
            </div>
            
            {/* 画像 */}
            <div style={{
              height: '120px',
              background: `linear-gradient(135deg, ${['#FFE5EC', '#E5E8FF', '#E5FFF6'][i % 3]}, ${['#FFF0E5', '#F5E5FF', '#E5F5FF'][i % 3]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}>
              {post.image}
            </div>
            
            {/* キャプション＆リアクション */}
            <div style={{ padding: '12px' }}>
              <p style={{
                fontSize: '13px',
                color: tokens.colors.text,
                margin: '0 0 8px',
                lineHeight: 1.4,
              }}>
                {post.caption}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span style={{ fontSize: '14px' }}>👍</span>
                  <span style={{
                    fontSize: '12px',
                    color: tokens.colors.textMuted,
                  }}>
                    {post.likes}
                  </span>
                </div>
                <button style={{
                  background: tokens.colors.surfaceAlt,
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: tokens.radius.full,
                  fontSize: '11px',
                  color: tokens.colors.primary,
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  👍 いいね
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Floating Action Buttons */}
    <div style={{
      position: 'absolute',
      bottom: '100px',
      left: '24px',
      right: '24px',
      display: 'flex',
      gap: '12px',
    }}>
      <button style={{
        flex: 1,
        background: 'white',
        border: '2px solid ' + tokens.colors.primary,
        borderRadius: tokens.radius.lg,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '700',
        color: tokens.colors.primary,
      }}>
        <span>📸</span> 投稿する
      </button>
      <button style={{
        flex: 1,
        background: tokens.colors.gradient1,
        border: 'none',
        borderRadius: tokens.radius.lg,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '700',
        color: 'white',
        boxShadow: tokens.shadows.glow,
      }}>
        <span>✨</span> プランを作る
      </button>
    </div>
    
    {/* Bottom Navigation */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      padding: '12px 40px 34px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTop: '1px solid #F0F0F5',
    }}>
      {[
        { icon: '🏠', label: 'ホーム', active: false },
        { icon: '🔔', label: '通知', active: false },
        { icon: '⚙️', label: '設定', active: false },
      ].map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          opacity: item.active ? 1 : 0.5,
        }}>
          <span style={{ fontSize: '24px' }}>{item.icon}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: item.active ? tokens.colors.primary : tokens.colors.textSecondary,
          }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
    
    <div style={{ ...baseStyles.homeIndicator, bottom: '8px' }}/>
  </div>
);

// ========================================
// Screen 5: 画像投稿 (Image Upload)
// ========================================
const ImageUploadScreen = () => (
  <div style={{
    ...baseStyles.container,
    background: '#000',
  }}>
    <div style={{ ...baseStyles.statusBar, color: 'white' }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span>📶</span><span>📡</span><span>🔋</span>
      </div>
    </div>
    
    <div style={{ padding: '10px 20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <button style={{
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          padding: '10px 16px',
          borderRadius: tokens.radius.full,
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          キャンセル
        </button>
        <h1 style={{
          fontSize: '17px',
          fontWeight: '700',
          color: 'white',
          margin: 0,
        }}>
          スクショを選ぶ
        </h1>
        <button style={{
          background: tokens.colors.primary,
          border: 'none',
          color: 'white',
          padding: '10px 20px',
          borderRadius: tokens.radius.full,
          fontSize: '15px',
          fontWeight: '700',
          cursor: 'pointer',
        }}>
          追加
        </button>
      </div>
      
      {/* Selected Preview */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: tokens.radius.lg,
        padding: '16px',
        marginBottom: '16px',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '13px',
          margin: '0 0 12px',
        }}>
          選択中 (2)
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['🍜', '☕'].map((img, i) => (
            <div key={i} style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, #FFE5EC, #FFF0E5)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              position: 'relative',
            }}>
              {img}
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '24px',
                height: '24px',
                background: tokens.colors.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Photo Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px',
      }}>
        {['🍜', '☕', '🌸', '🎮', '🛍️', '🍕', '🎪', '🎡', '🏖️', '🎵', '📚', '🎨'].map((img, i) => (
          <div key={i} style={{
            aspectRatio: '1',
            background: `linear-gradient(135deg, ${['#FFE5EC', '#E5E8FF', '#E5FFF6', '#FFF5E5'][i % 4]}, ${['#FFF0E5', '#F5E5FF', '#E5F5FF', '#FFE5F5'][i % 4]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            cursor: 'pointer',
            position: 'relative',
          }}>
            {img}
            {i < 2 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '24px',
                height: '24px',
                background: tokens.colors.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                {i + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    
    <div style={{ ...baseStyles.homeIndicator, background: 'white' }}/>
  </div>
);

// ========================================
// Screen 6: プラン生成中 (Loading)
// ========================================
const PlanLoadingScreen = () => (
  <div style={{
    ...baseStyles.container,
    background: tokens.colors.gradient3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {/* Animated Orb */}
    <div style={{
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      background: tokens.colors.gradient1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '40px',
      animation: 'pulse 2s ease-in-out infinite',
      boxShadow: tokens.shadows.glow,
    }}>
      <span style={{ fontSize: '64px', animation: 'bounce 1s ease-in-out infinite' }}>✨</span>
    </div>
    
    <h2 style={{
      fontSize: '24px',
      fontWeight: '700',
      color: tokens.colors.text,
      margin: '0 0 12px',
    }}>
      AIがプランを考え中...
    </h2>
    
    <p style={{
      fontSize: '15px',
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      margin: 0,
      maxWidth: '260px',
      lineHeight: 1.6,
    }}>
      みんなの「好き」を組み合わせて<br/>
      最高のルートを見つけています
    </p>
    
    {/* Progress Dots */}
    <div style={{
      display: 'flex',
      gap: '8px',
      marginTop: '40px',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: tokens.colors.primary,
          opacity: 0.3,
          animation: `dotPulse 1.5s ease-in-out ${i * 0.2}s infinite`,
        }}/>
      ))}
    </div>
    
    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes dotPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `}</style>
    
    <div style={baseStyles.homeIndicator}/>
  </div>
);

// ========================================
// Screen 7: プラン提案 (Plan Suggestions)
// ========================================
const PlanSuggestionsScreen = () => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [editingField, setEditingField] = useState(null);
  
  const plans = [
    {
      id: 0,
      name: '100%映える。最先端トレンド追求コース',
      emoji: '📸',
      color: '#FF6B9D',
      spots: [
        { id: 0, name: '原宿カフェ', time: '14:00', duration: '60分' },
        { id: 1, name: '渋谷スクランブル', time: '15:30', duration: '30分' },
        { id: 2, name: 'ミヤシタパーク', time: '16:30', duration: '90分' },
      ],
      totalTime: '約4時間',
      budget: '¥4,500',
    },
    {
      id: 1,
      name: '予算3000円！節約しつつ満足チルコース',
      emoji: '💰',
      color: '#00D4AA',
      spots: [
        { id: 0, name: '代々木公園', time: '13:00', duration: '90分' },
        { id: 1, name: 'コンビニグルメ', time: '15:00', duration: '30分' },
        { id: 2, name: '夜景スポット', time: '18:00', duration: '60分' },
      ],
      totalTime: '約3時間',
      budget: '¥2,800',
    },
    {
      id: 2,
      name: 'ガッツリ食べ歩き！グルメ満喫コース',
      emoji: '🍜',
      color: '#7C5CFF',
      spots: [
        { id: 0, name: 'ラーメン横丁', time: '12:00', duration: '60分' },
        { id: 1, name: 'スイーツ巡り', time: '14:00', duration: '90分' },
        { id: 2, name: '居酒屋', time: '18:00', duration: '120分' },
      ],
      totalTime: '約5時間',
      budget: '¥6,000',
    },
  ];

  return (
    <div style={{
      ...baseStyles.container,
      background: tokens.colors.gradient3,
      overflow: 'auto',
    }}>
      <div style={baseStyles.statusBar}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span>📶</span><span>📡</span><span>🔋</span>
        </div>
      </div>
      
      <div style={{ ...baseStyles.safeArea, paddingTop: '10px', paddingBottom: '120px' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '28px' }}>✨</span>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: tokens.colors.text,
              margin: 0,
            }}>
              3つのプランができました！
            </h1>
          </div>
          <p style={{
            fontSize: '14px',
            color: tokens.colors.textSecondary,
            margin: 0,
          }}>
            タップして編集・カスタマイズできます
          </p>
        </div>
        
        {/* Plan Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {plans.map((plan, i) => (
            <div key={plan.id} style={{
              background: 'white',
              borderRadius: tokens.radius.lg,
              overflow: 'hidden',
              boxShadow: tokens.shadows.soft,
              border: i === 0 ? `2px solid ${plan.color}` : '2px solid transparent',
              position: 'relative',
            }}>
              {i === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: plan.color,
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: tokens.radius.full,
                  fontSize: '11px',
                  fontWeight: '700',
                  zIndex: 1,
                }}>
                  おすすめ ⭐
                </div>
              )}
              
              {/* Plan Header - Clickable */}
              <div 
                onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}40)`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  flexShrink: 0,
                }}>
                  {plan.emoji}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: tokens.colors.text,
                    margin: '0 0 8px',
                    lineHeight: 1.4,
                    paddingRight: i === 0 ? '70px' : 0,
                  }}>
                    {plan.name}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '13px',
                      color: tokens.colors.textMuted,
                    }}>
                      🕐 {plan.totalTime}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: tokens.colors.textMuted,
                    }}>
                      💴 {plan.budget}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: tokens.colors.textMuted,
                    }}>
                      📍 {plan.spots.length}スポット
                    </span>
                  </div>
                </div>
                
                <div style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: tokens.colors.textMuted,
                  transform: expandedPlan === plan.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}>
                  ▼
                </div>
              </div>
              
              {/* Expanded Edit Section */}
              {expandedPlan === plan.id && (
                <div style={{
                  borderTop: '1px solid #F0F0F5',
                  padding: '16px',
                  background: tokens.colors.surfaceAlt,
                }}>
                  {/* Edit Hint */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                    padding: '10px 12px',
                    background: `${plan.color}15`,
                    borderRadius: tokens.radius.sm,
                  }}>
                    <span style={{ fontSize: '16px' }}>✏️</span>
                    <span style={{
                      fontSize: '12px',
                      color: plan.color,
                      fontWeight: '600',
                    }}>
                      各項目をタップして編集できます
                    </span>
                  </div>
                  
                  {/* Spots List - Editable */}
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: tokens.colors.textMuted,
                      margin: '0 0 10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      スポット
                    </p>
                    
                    {plan.spots.map((spot, j) => (
                      <div key={spot.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: j < plan.spots.length - 1 ? '8px' : 0,
                        padding: '12px',
                        background: 'white',
                        borderRadius: tokens.radius.sm,
                        border: '1px solid #E5E7EB',
                      }}>
                        {/* Order Number */}
                        <div style={{
                          width: '28px',
                          height: '28px',
                          background: plan.color,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '700',
                          flexShrink: 0,
                        }}>
                          {j + 1}
                        </div>
                        
                        {/* Spot Details - Editable */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '4px',
                          }}>
                            <input
                              type="text"
                              defaultValue={spot.name}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: tokens.colors.text,
                                padding: '2px 4px',
                                borderRadius: '4px',
                                outline: 'none',
                                width: '100%',
                                cursor: 'text',
                              }}
                              onFocus={(e) => e.target.style.background = '#F5F7FF'}
                              onBlur={(e) => e.target.style.background = 'transparent'}
                            />
                            <span style={{ 
                              fontSize: '12px', 
                              color: tokens.colors.textMuted,
                              cursor: 'pointer',
                            }}>✏️</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              <span style={{ fontSize: '11px' }}>🕐</span>
                              <input
                                type="text"
                                defaultValue={spot.time}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  fontSize: '12px',
                                  color: tokens.colors.textSecondary,
                                  padding: '2px 4px',
                                  borderRadius: '4px',
                                  outline: 'none',
                                  width: '50px',
                                  cursor: 'text',
                                }}
                                onFocus={(e) => e.target.style.background = '#F5F7FF'}
                                onBlur={(e) => e.target.style.background = 'transparent'}
                              />
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              <span style={{ fontSize: '11px' }}>⏱️</span>
                              <input
                                type="text"
                                defaultValue={spot.duration}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  fontSize: '12px',
                                  color: tokens.colors.textSecondary,
                                  padding: '2px 4px',
                                  borderRadius: '4px',
                                  outline: 'none',
                                  width: '50px',
                                  cursor: 'text',
                                }}
                                onFocus={(e) => e.target.style.background = '#F5F7FF'}
                                onBlur={(e) => e.target.style.background = 'transparent'}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Drag Handle */}
                        <div style={{
                          color: tokens.colors.textMuted,
                          fontSize: '16px',
                          cursor: 'grab',
                          padding: '4px',
                        }}>
                          ⋮⋮
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Spot Button */}
                    <button style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '12px',
                      background: 'white',
                      border: `2px dashed ${plan.color}40`,
                      borderRadius: tokens.radius.sm,
                      fontSize: '13px',
                      fontWeight: '600',
                      color: plan.color,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}>
                      <span>＋</span> スポットを追加
                    </button>
                  </div>
                  
                  {/* Budget & Time Edit */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      flex: 1,
                      padding: '12px',
                      background: 'white',
                      borderRadius: tokens.radius.sm,
                      border: '1px solid #E5E7EB',
                    }}>
                      <p style={{
                        fontSize: '11px',
                        color: tokens.colors.textMuted,
                        margin: '0 0 4px',
                        fontWeight: '600',
                      }}>
                        💴 予算
                      </p>
                      <input
                        type="text"
                        defaultValue={plan.budget}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: tokens.colors.text,
                          padding: 0,
                          outline: 'none',
                          width: '100%',
                        }}
                      />
                    </div>
                    <div style={{
                      flex: 1,
                      padding: '12px',
                      background: 'white',
                      borderRadius: tokens.radius.sm,
                      border: '1px solid #E5E7EB',
                    }}>
                      <p style={{
                        fontSize: '11px',
                        color: tokens.colors.textMuted,
                        margin: '0 0 4px',
                        fontWeight: '600',
                      }}>
                        🕐 所要時間
                      </p>
                      <input
                        type="text"
                        defaultValue={plan.totalTime}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: tokens.colors.text,
                          padding: 0,
                          outline: 'none',
                          width: '100%',
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* AI Regenerate Button */}
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: 'white',
                    border: `1px solid ${plan.color}`,
                    borderRadius: tokens.radius.sm,
                    fontSize: '13px',
                    fontWeight: '600',
                    color: plan.color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                    <span>🤖</span> AIに再提案してもらう
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Fixed Action Button */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px 40px',
        background: 'linear-gradient(0deg, white 70%, transparent 100%)',
      }}>
        <button style={{
          width: '100%',
          background: tokens.colors.gradient1,
          border: 'none',
          borderRadius: tokens.radius.lg,
          padding: '18px',
          fontSize: '17px',
          fontWeight: '700',
          color: 'white',
          cursor: 'pointer',
          boxShadow: tokens.shadows.glow,
        }}>
          このプランを選ぶ ✨
        </button>
      </div>
      
      <div style={baseStyles.homeIndicator}/>
    </div>
  );
};

// ========================================
// Screen 8: プラン詳細 (Plan Detail)
// ========================================
const PlanDetailScreen = () => (
  <div style={{
    ...baseStyles.container,
    background: tokens.colors.gradient3,
  }}>
    <div style={baseStyles.statusBar}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span>📶</span><span>📡</span><span>🔋</span>
      </div>
    </div>
    
    <div style={{ ...baseStyles.safeArea, paddingTop: '10px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <button style={{
          background: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: tokens.shadows.soft,
        }}>
          <span style={{ fontSize: '18px' }}>←</span>
        </button>
        <h1 style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: '700',
          color: tokens.colors.text,
          margin: 0,
        }}>
          プラン詳細
        </h1>
        <button style={{
          background: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: tokens.shadows.soft,
        }}>
          <span style={{ fontSize: '18px' }}>↗</span>
        </button>
      </div>
      
      {/* Plan Header Card */}
      <div style={{
        background: tokens.colors.gradient1,
        borderRadius: tokens.radius.lg,
        padding: '24px',
        marginBottom: '20px',
        color: 'white',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '32px' }}>📸</span>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
            lineHeight: 1.3,
          }}>
            100%映える。<br/>最先端トレンド追求コース
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>🕐 約4時間</span>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>💴 ¥4,500</span>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>📍 3スポット</span>
        </div>
      </div>
      
      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {[
          { time: '14:00', title: '原宿カフェ ☕', desc: 'インスタ映え確実！韓国風カフェ', duration: '60分' },
          { time: '15:30', title: '渋谷スクランブル 🚶', desc: '世界一有名な交差点で記念撮影', duration: '30分' },
          { time: '16:30', title: 'ミヤシタパーク 🛍️', desc: 'ルーフトップでショッピング＆夕日', duration: '90分' },
        ].map((spot, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '16px',
            marginBottom: i < 2 ? '24px' : 0,
            position: 'relative',
          }}>
            {/* Timeline Line */}
            {i < 2 && (
              <div style={{
                position: 'absolute',
                left: '23px',
                top: '50px',
                width: '2px',
                height: 'calc(100% + 24px)',
                background: `linear-gradient(180deg, ${tokens.colors.primary} 0%, ${tokens.colors.surfaceAlt} 100%)`,
              }}/>
            )}
            
            {/* Time */}
            <div style={{
              width: '48px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: tokens.colors.gradient1,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '4px',
                position: 'relative',
                zIndex: 1,
              }}>
                {i + 1}
              </div>
              <span style={{
                fontSize: '12px',
                color: tokens.colors.textMuted,
              }}>
                {spot.time}
              </span>
            </div>
            
            {/* Content */}
            <div style={{
              flex: 1,
              background: 'white',
              borderRadius: tokens.radius.md,
              padding: '16px',
              boxShadow: tokens.shadows.soft,
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: tokens.colors.text,
                margin: '0 0 4px',
              }}>
                {spot.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: tokens.colors.textSecondary,
                margin: '0 0 8px',
              }}>
                {spot.desc}
              </p>
              <span style={{
                background: tokens.colors.surfaceAlt,
                padding: '4px 10px',
                borderRadius: tokens.radius.full,
                fontSize: '12px',
                color: tokens.colors.textMuted,
              }}>
                ⏱️ {spot.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Share Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
      }}>
        <button style={{
          flex: 1,
          background: '#06C755',
          border: 'none',
          borderRadius: tokens.radius.lg,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '700',
          color: 'white',
        }}>
          LINEでシェア 💬
        </button>
        <button style={{
          width: '56px',
          background: 'white',
          border: '2px solid #E5E7EB',
          borderRadius: tokens.radius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '20px',
        }}>
          🔗
        </button>
      </div>
    </div>
    
    <div style={baseStyles.homeIndicator}/>
  </div>
);

// ========================================
// Main App - All Screens Display
// ========================================
export default function PlanLikeUIDesign() {
  const [activeScreen, setActiveScreen] = useState(0);
  
  const screens = [
    { name: 'スプラッシュ', component: <SplashScreen /> },
    { name: 'ログイン', component: <AuthScreen /> },
    { name: 'ホーム', component: <HomeScreen /> },
    { name: '広場詳細', component: <HirobaDetailScreen /> },
    { name: '画像投稿', component: <ImageUploadScreen /> },
    { name: 'プラン生成中', component: <PlanLoadingScreen /> },
    { name: 'プラン提案', component: <PlanSuggestionsScreen /> },
    { name: 'プラン詳細', component: <PlanDetailScreen /> },
  ];
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #FF6B9D, #7C5CFF, #00D4AA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 16px',
        }}>
          PlanLike UI Design
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.7)',
          margin: 0,
        }}>
          みんなの「好き」を、AIがひとつの物語にする。
        </p>
      </div>
      
      {/* Screen Navigation */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '40px',
      }}>
        {screens.map((screen, i) => (
          <button
            key={i}
            onClick={() => setActiveScreen(i)}
            style={{
              background: activeScreen === i 
                ? 'linear-gradient(135deg, #FF6B9D, #7C5CFF)' 
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '100px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {screen.name}
          </button>
        ))}
      </div>
      
      {/* Active Screen Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '60px',
      }}>
        {screens[activeScreen].component}
      </div>
      
      {/* All Screens Grid */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          全画面一覧
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          justifyItems: 'center',
        }}>
          {screens.map((screen, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ 
                transform: 'scale(0.65)', 
                transformOrigin: 'top center',
                marginBottom: '-200px',
              }}>
                {screen.component}
              </div>
              <p style={{
                marginTop: '220px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                {i + 1}. {screen.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Design System Info */}
      <div style={{
        maxWidth: '800px',
        margin: '80px auto 0',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '24px',
        padding: '32px',
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '20px',
        }}>
          🎨 デザインシステム
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '0 0 8px' }}>Primary Colors</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['#FF6B9D', '#7C5CFF', '#00D4AA', '#FFB347'].map(c => (
                <div key={c} style={{
                  width: '40px',
                  height: '40px',
                  background: c,
                  borderRadius: '10px',
                }}/>
              ))}
            </div>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '0 0 8px' }}>Border Radius</p>
            <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>12px / 20px / 28px / 36px</p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '0 0 8px' }}>Typography</p>
            <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>SF Pro Display</p>
          </div>
        </div>
      </div>
    </div>
  );
}
