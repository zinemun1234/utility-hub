import { loadStripe } from '@stripe/stripe-js'

// Stripe 공개 키 (실제 운영시에는 환경 변수로 관리)
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51...' // 테스트 키

// Stripe 인스턴스 로드
const stripePromise = loadStripe(stripePublicKey)

// 구독 플랜 정보
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    priceId: 'price_basic_monthly', // Stripe에서 생성된 Price ID
    price: 2.99,
    currency: 'usd',
    interval: 'month',
    features: [
      '광고 제거',
      '무제한 QR 코드 생성',
      '무제한 링크 단축',
      '기본 분석',
      '이메일 지원'
    ]
  },
  pro: {
    name: 'Pro',
    priceId: 'price_pro_monthly', // Stripe에서 생성된 Price ID
    price: 4.99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Basic의 모든 기능',
      '고급 분석 및 통계',
      '사용자 정의 도메인',
      '대량 처리',
      '우선 지원',
      'API 액세스',
      '내보내기 기능'
    ]
  }
}

// 결제 세션 생성
export const createCheckoutSession = async (planType: 'basic' | 'pro', userEmail?: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: SUBSCRIPTION_PLANS[planType].priceId,
        planType,
        userEmail,
        successUrl: `${window.location.origin}/premium/success?plan=${planType}`,
        cancelUrl: `${window.location.origin}/premium/cancel`,
      }),
    })

    const session = await response.json()
    
    if (!session.id) {
      throw new Error('결제 세션 생성에 실패했습니다')
    }

    // Stripe Checkout으로 리디렉션
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe 로드에 실패했습니다')
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('결제 오류:', error)
    throw error
  }
}

// 사용자 구독 상태 확인
export const checkSubscriptionStatus = async () => {
  try {
    const response = await fetch('/api/subscription-status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('구독 상태 확인 실패')
    }
    
    return await response.json()
  } catch (error) {
    console.error('구독 상태 확인 오류:', error)
    return { active: false, plan: null }
  }
}

// 구독 취소
export const cancelSubscription = async () => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('구독 취소 실패')
    }
    
    return await response.json()
  } catch (error) {
    console.error('구독 취소 오류:', error)
    throw error
  }
}

// 로컬 스토리지에 프리미엄 상태 저장 (임시)
export const setPremiumStatus = (isPremium: boolean, plan?: string) => {
  localStorage.setItem('isPremium', isPremium.toString())
  if (plan) {
    localStorage.setItem('premiumPlan', plan)
  }
}

export const getPremiumStatus = () => {
  const isPremium = localStorage.getItem('isPremium') === 'true'
  const plan = localStorage.getItem('premiumPlan')
  return { isPremium, plan }
}

// 프리미엄 기능 접근 제한 체크
export const checkPremiumFeature = (featureName: string) => {
  const { isPremium } = getPremiumStatus()
  
  if (!isPremium) {
    throw new Error(`${featureName}은(는) 프리미엄 기능입니다. 업그레이드해주세요!`)
  }
  
  return true
} 