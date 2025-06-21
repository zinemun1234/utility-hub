import React, { useState } from 'react'
import { X, Crown, Check, Zap, Loader } from 'lucide-react'
import { createCheckoutSession } from '../utils/stripe'
import toast from 'react-hot-toast'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<string | null>(null)
  
  if (!isOpen) return null

  const handleSubscribe = async (planType: 'basic' | 'pro') => {
    setLoading(planType)
    try {
      await createCheckoutSession(planType)
    } catch (error) {
      console.error('결제 오류:', error)
      toast.error('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$2.99',
      period: '/월',
      features: [
        '광고 제거',
        '무제한 QR 코드 생성',
        '무제한 링크 단축',
        '기본 분석',
        '이메일 지원'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$4.99',
      period: '/월',
      features: [
        'Basic의 모든 기능',
        '고급 분석 및 통계',
        '사용자 정의 도메인',
        '대량 처리',
        '우선 지원',
        'API 액세스',
        '내보내기 기능'
      ],
      popular: true,
      color: 'purple'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">프리미엄으로 업그레이드</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">더 많은 기능과 무제한 사용</h3>
            <p className="text-gray-600">프리미엄 플랜으로 모든 도구를 제한 없이 사용하세요</p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative border-2 rounded-lg p-6 ${
                  plan.popular
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      인기
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={() => handleSubscribe(plan.id as 'basic' | 'pro')}
                  disabled={loading !== null}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader className="inline h-4 w-4 mr-2 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Zap className="inline h-4 w-4 mr-2" />
                      {plan.name} 시작하기
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Features showcase */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold mb-4">프리미엄 혜택</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">광고 없는 경험</div>
                  <div className="text-gray-600">방해받지 않고 도구를 사용하세요</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">고급 분석</div>
                  <div className="text-gray-600">상세한 사용 통계와 인사이트</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">우선 지원</div>
                  <div className="text-gray-600">빠른 문제 해결과 기술 지원</div>
                </div>
              </div>
            </div>
          </div>

          {/* Money back guarantee */}
          <div className="text-center mt-6 text-sm text-gray-600">
            💰 30일 환불 보장 • 🔒 안전한 결제 • ⚡ 즉시 활성화
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumModal 