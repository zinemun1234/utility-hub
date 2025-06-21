import React from 'react'
import { Crown, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const TestPremium: React.FC = () => {
  const activatePremium = async (planType: 'basic' | 'pro') => {
    try {
      const response = await fetch('/api/activate-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      })

      const result = await response.json()
      
      if (result.success) {
        // 로컬 스토리지에 저장
        localStorage.setItem('isPremium', 'true')
        localStorage.setItem('premiumPlan', planType)
        
        toast.success(`${planType.toUpperCase()} 플랜이 활성화되었습니다!`)
        
        // 페이지 새로고침하여 상태 반영
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error('프리미엄 활성화에 실패했습니다')
      }
    } catch (error) {
      console.error('프리미엄 활성화 오류:', error)
      toast.error('오류가 발생했습니다')
    }
  }

  const deactivatePremium = () => {
    localStorage.removeItem('isPremium')
    localStorage.removeItem('premiumPlan')
    toast.success('프리미엄이 비활성화되었습니다')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Crown className="h-5 w-5 mr-2 text-yellow-500" />
        🧪 테스트용 프리미엄 컨트롤
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        개발 중에만 사용되는 테스트용 기능입니다
      </p>
      
      <div className="space-y-2">
        <button
          onClick={() => activatePremium('basic')}
          className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
        >
          <Zap className="inline h-4 w-4 mr-1" />
          Basic 플랜 활성화
        </button>
        
        <button
          onClick={() => activatePremium('pro')}
          className="w-full py-2 px-3 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors"
        >
          <Zap className="inline h-4 w-4 mr-1" />
          Pro 플랜 활성화
        </button>
        
        <button
          onClick={deactivatePremium}
          className="w-full py-2 px-3 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm transition-colors"
        >
          프리미엄 비활성화
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        ⚠️ 실제 배포 시에는 이 컴포넌트를 제거하세요
      </div>
    </div>
  )
}

export default TestPremium 