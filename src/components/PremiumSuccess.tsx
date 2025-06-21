import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Crown, ArrowRight } from 'lucide-react'

const PremiumSuccess: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'basic'

  useEffect(() => {
    // 결제 성공 시 프리미엄 상태 활성화
    localStorage.setItem('isPremium', 'true')
    localStorage.setItem('premiumPlan', plan)
    
    // 5초 후 홈으로 자동 이동
    const timer = setTimeout(() => {
      navigate('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [plan, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 결제가 완료되었습니다!
          </h1>
          <p className="text-gray-600">
            프리미엄 {plan === 'pro' ? 'Pro' : 'Basic'} 플랜이 활성화되었습니다
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
          <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold text-purple-900 mb-2">
            {plan === 'pro' ? 'Pro' : 'Basic'} 플랜 혜택
          </h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>✨ 광고 완전 제거</li>
            <li>🚀 무제한 도구 사용</li>
            <li>📊 고급 분석 기능</li>
            {plan === 'pro' && (
              <>
                <li>🔧 API 액세스</li>
                <li>💎 우선 지원</li>
              </>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
          >
            도구 사용하러 가기
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
          
          <p className="text-sm text-gray-500">
            5초 후 자동으로 홈으로 이동합니다...
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            결제 내역은 이메일로 전송됩니다.<br />
            문의사항이 있으시면 언제든 연락주세요.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PremiumSuccess 