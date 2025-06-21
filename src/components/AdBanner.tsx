import React from 'react'

const AdBanner: React.FC = () => {
  return (
    <div className="ad-banner">
      <div className="text-center">
        <p className="font-medium">광고 영역</p>
        <p className="text-xs mt-1">Google AdSense</p>
      </div>
      
      {/* 실제 AdSense 코드는 여기에 삽입 */}
      {/* 
      <ins className="adsbygoogle"
           style={{display: 'block'}}
           data-ad-client="ca-pub-YOUR-PUBLISHER-ID"
           data-ad-slot="YOUR-AD-SLOT-ID"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      */}
    </div>
  )
}

export default AdBanner 