import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './components/Home'
import QRGenerator from './components/QRGenerator'
import LinkShortener from './components/LinkShortener'
import PasswordGenerator from './components/PasswordGenerator'
import ColorTools from './components/ColorTools'
import TextTools from './components/TextTools'
import AdBanner from './components/AdBanner'
import PremiumModal from './components/PremiumModal'
import TestPremium from './components/TestPremium'
import PremiumSuccess from './components/PremiumSuccess'
import { checkSubscriptionStatus, getPremiumStatus } from './utils/stripe'

function App() {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [premiumPlan, setPremiumPlan] = useState<string | null>(null)

  useEffect(() => {
    // 로컬 스토리지에서 프리미엄 상태 확인
    const { isPremium: localPremium, plan } = getPremiumStatus()
    setIsPremium(localPremium)
    setPremiumPlan(plan)

    // 서버에서 구독 상태 확인
    checkSubscriptionStatus()
      .then(response => {
        if (response.data.active) {
          setIsPremium(true)
          setPremiumPlan(response.data.plan)
          localStorage.setItem('isPremium', 'true')
          localStorage.setItem('premiumPlan', response.data.plan)
        }
      })
      .catch(error => {
        console.error('구독 상태 확인 실패:', error)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/qr-generator" element={<QRGenerator />} />
              <Route path="/link-shortener" element={<LinkShortener />} />
              <Route path="/password-generator" element={<PasswordGenerator />} />
              <Route path="/color-tools" element={<ColorTools />} />
              <Route path="/text-tools" element={<TextTools />} />
              <Route path="/premium/success" element={<PremiumSuccess />} />
            </Routes>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {!isPremium && <AdBanner />}
              
              {isPremium ? (
                <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <h3 className="text-lg font-semibold mb-2">🎉 프리미엄 활성화</h3>
                  <p className="text-sm opacity-90 mb-3">
                    {premiumPlan === 'pro' ? 'Pro' : 'Basic'} 플랜을 이용 중입니다
                  </p>
                  <div className="text-xs opacity-75">
                    광고 없는 무제한 사용 중
                  </div>
                </div>
              ) : (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-3">💎 프리미엄 업그레이드</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    광고 없이 무제한 사용하고 더 많은 기능을 이용하세요!
                  </p>
                  <button 
                    className="btn-primary w-full"
                    onClick={() => setIsPremiumModalOpen(true)}
                  >
                    월 $2.99로 업그레이드
                  </button>
                </div>
              )}
              
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">📊 오늘의 통계</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>QR 코드 생성:</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>링크 단축:</span>
                    <span className="font-medium">567</span>
                  </div>
                  <div className="flex justify-between">
                    <span>비밀번호 생성:</span>
                    <span className="font-medium">890</span>
                  </div>
                </div>
              </div>
              
              {/* 개발 환경에서만 표시되는 테스트 컨트롤 */}
              <TestPremium />
            </div>
          </div>
        </div>
      </main>
      
      {/* Premium Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-3">UtilityHub</h4>
              <p className="text-sm text-gray-600">
                무료 온라인 유틸리티 도구 모음
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">도구</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>QR 코드 생성기</li>
                <li>링크 단축기</li>
                <li>비밀번호 생성기</li>
                <li>색상 도구</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">지원</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>도움말</li>
                <li>문의하기</li>
                <li>API 문서</li>
                <li>개발자 도구</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">회사</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>소개</li>
                <li>프라이버시</li>
                <li>이용약관</li>
                <li>블로그</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-gray-600">
            <p>&copy; 2024 UtilityHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App 