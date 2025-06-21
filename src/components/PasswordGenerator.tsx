import React, { useState, useEffect } from 'react'
import { Key, Copy, RefreshCw, Shield, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const similarChars = 'il1Lo0O'

  const getPasswordStrength = (pwd: string) => {
    let score = 0
    
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    if (pwd.length >= 16) score += 1

    if (score <= 2) return { level: 'weak', color: 'text-red-500', bg: 'bg-red-500', label: '약함' }
    if (score <= 4) return { level: 'medium', color: 'text-yellow-500', bg: 'bg-yellow-500', label: '보통' }
    if (score <= 6) return { level: 'strong', color: 'text-green-500', bg: 'bg-green-500', label: '강함' }
    return { level: 'very-strong', color: 'text-green-600', bg: 'bg-green-600', label: '매우 강함' }
  }

  const generatePassword = () => {
    let charset = ''
    
    if (includeUppercase) charset += uppercaseChars
    if (includeLowercase) charset += lowercaseChars
    if (includeNumbers) charset += numberChars
    if (includeSymbols) charset += symbolChars
    
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('')
    }

    if (!charset) {
      toast.error('최소 하나의 문자 유형을 선택해주세요')
      return
    }

    let newPassword = ''
    
    // 각 유형에서 최소 하나씩 포함하도록 보장
    if (includeUppercase) newPassword += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
    if (includeLowercase) newPassword += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
    if (includeNumbers) newPassword += numberChars[Math.floor(Math.random() * numberChars.length)]
    if (includeSymbols) newPassword += symbolChars[Math.floor(Math.random() * symbolChars.length)]

    // 나머지 길이만큼 랜덤하게 채우기
    for (let i = newPassword.length; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)]
    }

    // 문자 순서 섞기
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('')
    
    setPassword(newPassword)
    
    // 히스토리에 추가 (최대 10개)
    setPasswordHistory(prev => {
      const updated = [newPassword, ...prev.filter(p => p !== newPassword)]
      return updated.slice(0, 10)
    })

    toast.success('새 비밀번호가 생성되었습니다!')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('클립보드에 복사되었습니다!')
    } catch (error) {
      toast.error('복사에 실패했습니다')
    }
  }

  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar])

  const strength = password ? getPasswordStrength(password) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">비밀번호 생성기</h1>
        <p className="text-gray-600">안전하고 강력한 비밀번호를 생성하여 계정을 보호하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Display */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Key className="h-5 w-5 mr-2" />
            생성된 비밀번호
          </h2>
          
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                readOnly
                className="input-field font-mono text-lg flex-1"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-gray-500 hover:text-gray-700"
                title={showPassword ? '숨기기' : '보이기'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {strength && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm text-gray-600">강도:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${strength.bg} transition-all duration-300`}
                    style={{ width: `${strength.level === 'weak' ? 25 : strength.level === 'medium' ? 50 : strength.level === 'strong' ? 75 : 100}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(password)}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>복사</span>
              </button>
              
              <button
                onClick={generatePassword}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>새로 생성</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">설정</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              길이: {length}자
            </label>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>50</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>대문자 (A-Z)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>소문자 (a-z)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>숫자 (0-9)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>특수문자 (!@#$%^&*)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>유사한 문자 제외 (i, l, 1, L, o, 0, O)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Password History */}
      {passwordHistory.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">최근 생성된 비밀번호</h2>
          <div className="space-y-2">
            {passwordHistory.map((pwd, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="font-mono text-sm flex-1">{showPassword ? pwd : '•'.repeat(pwd.length)}</span>
                <button
                  onClick={() => copyToClipboard(pwd)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="복사"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold flex items-center mb-3">
          <Shield className="h-5 w-5 mr-2" />
          🔒 보안 팁
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">고유한 비밀번호</h4>
            <p>각 계정마다 다른 비밀번호를 사용하세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">정기적 변경</h4>
            <p>중요한 계정의 비밀번호는 3-6개월마다 변경하세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">안전한 저장</h4>
            <p>비밀번호 관리자를 사용하여 안전하게 저장하세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">2단계 인증</h4>
            <p>가능한 모든 계정에서 2단계 인증을 활성화하세요.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordGenerator