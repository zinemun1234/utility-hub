import React, { useState, useMemo } from 'react'
import { Type, Copy, Hash, AlignLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const TextTools: React.FC = () => {
  const [text, setText] = useState('')
  
  const textStats = useMemo(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
    const lines = text ? text.split('\n').length : 0
    
    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines
    }
  }, [text])

  const transformedTexts = useMemo(() => {
    return {
      uppercase: text.toUpperCase(),
      lowercase: text.toLowerCase(),
      titleCase: text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentenceCase: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      camelCase: text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, ''),
      pascalCase: text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
        word.toUpperCase()
      ).replace(/\s+/g, ''),
      snakeCase: text.toLowerCase().replace(/\s+/g, '_'),
      kebabCase: text.toLowerCase().replace(/\s+/g, '-'),
      reversed: text.split('').reverse().join(''),
      alternatingCase: text.split('').map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join('')
    }
  }, [text])

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      toast.success('클립보드에 복사되었습니다!')
    } catch (error) {
      toast.error('복사에 실패했습니다')
    }
  }

  const textTransforms = [
    { key: 'uppercase', label: '대문자', value: transformedTexts.uppercase },
    { key: 'lowercase', label: '소문자', value: transformedTexts.lowercase },
    { key: 'titleCase', label: '제목 케이스', value: transformedTexts.titleCase },
    { key: 'sentenceCase', label: '문장 케이스', value: transformedTexts.sentenceCase },
    { key: 'camelCase', label: '카멜 케이스', value: transformedTexts.camelCase },
    { key: 'pascalCase', label: '파스칼 케이스', value: transformedTexts.pascalCase },
    { key: 'snakeCase', label: '스네이크 케이스', value: transformedTexts.snakeCase },
    { key: 'kebabCase', label: '케밥 케이스', value: transformedTexts.kebabCase },
    { key: 'reversed', label: '역순', value: transformedTexts.reversed },
    { key: 'alternatingCase', label: '교대 케이스', value: transformedTexts.alternatingCase }
  ]

  const removeExtraSpaces = () => {
    const cleaned = text.replace(/\s+/g, ' ').trim()
    setText(cleaned)
    toast.success('여분의 공백이 제거되었습니다!')
  }

  const removeLineBreaks = () => {
    const cleaned = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
    setText(cleaned)
    toast.success('줄바꿈이 제거되었습니다!')
  }

  const addLineNumbers = () => {
    const lines = text.split('\n')
    const numbered = lines.map((line, index) => `${index + 1}. ${line}`).join('\n')
    setText(numbered)
    toast.success('줄 번호가 추가되었습니다!')
  }

  const sortLines = (ascending: boolean = true) => {
    const lines = text.split('\n')
    const sorted = lines.sort((a, b) => {
      return ascending ? a.localeCompare(b) : b.localeCompare(a)
    })
    setText(sorted.join('\n'))
    toast.success(`줄이 ${ascending ? '오름차순' : '내림차순'}으로 정렬되었습니다!`)
  }

  const removeDuplicateLines = () => {
    const lines = text.split('\n')
    const unique = [...new Set(lines)]
    setText(unique.join('\n'))
    toast.success('중복 줄이 제거되었습니다!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">텍스트 도구</h1>
        <p className="text-gray-600">텍스트 변환, 분석, 정리 도구</p>
      </div>

      {/* Text Input */}
      <div className="card">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <Type className="h-5 w-5 mr-2" />
          텍스트 입력
        </h2>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="변환하거나 분석할 텍스트를 입력하세요..."
          className="input-field h-40 resize-none"
        />
        
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={removeExtraSpaces}
            className="btn-secondary text-sm"
            disabled={!text}
          >
            여분 공백 제거
          </button>
          <button
            onClick={removeLineBreaks}
            className="btn-secondary text-sm"
            disabled={!text}
          >
            줄바꿈 제거
          </button>
          <button
            onClick={addLineNumbers}
            className="btn-secondary text-sm"
            disabled={!text}
          >
            줄 번호 추가
          </button>
          <button
            onClick={() => sortLines(true)}
            className="btn-secondary text-sm"
            disabled={!text}
          >
            줄 정렬 (오름차순)
          </button>
          <button
            onClick={() => sortLines(false)}
            className="btn-secondary text-sm"
            disabled={!text}
          >
            줄 정렬 (내림차순)
          </button>
          <button
            onClick={removeDuplicateLines}
            className="btn-secondary text-sm"
            disabled={!text}
          >
            중복 줄 제거
          </button>
          <button
            onClick={() => setText('')}
            className="btn-secondary text-sm text-red-600"
            disabled={!text}
          >
            전체 지우기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Statistics */}
        <div className="card">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Hash className="h-5 w-5 mr-2" />
            텍스트 통계
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{textStats.characters}</div>
              <div className="text-sm text-gray-600">전체 문자</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{textStats.charactersNoSpaces}</div>
              <div className="text-sm text-gray-600">공백 제외 문자</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{textStats.words}</div>
              <div className="text-sm text-gray-600">단어</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{textStats.sentences}</div>
              <div className="text-sm text-gray-600">문장</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{textStats.paragraphs}</div>
              <div className="text-sm text-gray-600">문단</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{textStats.lines}</div>
              <div className="text-sm text-gray-600">줄</div>
            </div>
          </div>

          {text && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">읽기 예상 시간</h4>
              <div className="text-sm text-blue-800">
                <div>빠른 읽기 (300 wpm): {Math.ceil(textStats.words / 300)}분</div>
                <div>보통 읽기 (200 wpm): {Math.ceil(textStats.words / 200)}분</div>
                <div>느린 읽기 (150 wpm): {Math.ceil(textStats.words / 150)}분</div>
              </div>
            </div>
          )}
        </div>

        {/* Text Transformations */}
        <div className="card">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <AlignLeft className="h-5 w-5 mr-2" />
            텍스트 변환
          </h2>
          
          <div className="space-y-3">
            {textTransforms.map((transform) => (
              <div key={transform.key} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{transform.label}</span>
                  <button
                    onClick={() => copyToClipboard(transform.value)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    disabled={!text}
                    title="복사"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded font-mono break-all">
                  {transform.value || '변환된 텍스트가 여기에 표시됩니다'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Text Encoding/Decoding */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">텍스트 인코딩/디코딩</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Base64 인코딩</h3>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono break-all">
                {text ? btoa(unescape(encodeURIComponent(text))) : '인코딩된 텍스트'}
              </code>
              <button
                onClick={() => copyToClipboard(text ? btoa(unescape(encodeURIComponent(text))) : '')}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={!text}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">URL 인코딩</h3>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono break-all">
                {text ? encodeURIComponent(text) : '인코딩된 URL'}
              </code>
              <button
                onClick={() => copyToClipboard(text ? encodeURIComponent(text) : '')}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={!text}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">💡 사용 팁</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">케이스 변환</h4>
            <p>프로그래밍에서 다양한 명명 규칙에 맞게 텍스트를 변환할 수 있습니다.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">텍스트 정리</h4>
            <p>여분의 공백이나 줄바꿈을 제거하여 깔끔한 텍스트를 만들 수 있습니다.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">통계 분석</h4>
            <p>글의 길이와 복잡도를 파악하여 읽기 시간을 예측할 수 있습니다.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">인코딩</h4>
            <p>웹 개발에서 필요한 Base64, URL 인코딩을 간편하게 할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextTools 