# UtilityHub

여러 가지 유용한 온라인 도구들을 한 곳에 모은 웹사이트입니다. QR코드 만들기, 링크 줄이기, 비밀번호 생성 등을 할 수 있어요.

## 뭘 할 수 있나요?

**주요 기능들:**
- QR 코드 생성기 - 텍스트나 URL을 QR코드로 만들어줍니다
- 링크 단축기 - 긴 URL을 짧게 줄여줍니다 (클릭 수도 볼 수 있어요)
- 비밀번호 생성기 - 안전한 비밀번호를 자동으로 만들어줍니다
- 색상 도구 - 색상 팔레트 만들기, 색상 변환 등
- 텍스트 도구 - 대소문자 변환, 텍스트 분석 등

**수익 모델:**
- 광고 (Google AdSense)
- 프리미엄 구독 (월 $2.99-$4.99)
- API 서비스

## 기술 스택

**프론트엔드:**
- React 18 + TypeScript
- Vite (개발 도구)
- Tailwind CSS (디자인)

**백엔드:**
- Node.js + Express
- Stripe (결제 처리)

**주요 라이브러리:**
- qrcode (QR코드 생성)
- react-router (페이지 이동)
- lucide-react (아이콘)

## 설치하고 실행하기

1. **저장소 다운로드**
```bash
git clone https://github.com/zinemun1234/utility-hub.git
cd utility-hub
```

2. **패키지 설치**
```bash
npm install
```

3. **실행하기**
```bash
# 프론트엔드와 백엔드 동시 실행
npm start

# 또는 따로 실행
npm run dev      # 프론트엔드 (포트 3000)
npm run server   # 백엔드 (포트 5000)
```

브라우저에서 `http://localhost:3000`으로 접속하면 됩니다!

## 프로젝트 구조

```
utility-hub/
├── src/                    # 프론트엔드 소스
│   ├── components/         # React 컴포넌트들
│   │   ├── QRGenerator.tsx
│   │   ├── LinkShortener.tsx
│   │   ├── PasswordGenerator.tsx
│   │   └── ...
│   ├── utils/             # 유틸리티 함수들
│   └── App.tsx            # 메인 앱
├── server/                # 백엔드 서버
│   └── server.js          # Express 서버
├── package.json           # 패키지 설정
└── README.md             # 이 문서
```

## 📁 프로젝트 구조

```
utility-hub/
├── public/                 # 정적 파일
├── src/                   # React 소스 코드
│   ├── components/        # React 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Home.tsx
│   │   ├── QRGenerator.tsx
│   │   ├── LinkShortener.tsx
│   │   ├── PasswordGenerator.tsx
│   │   ├── ColorTools.tsx
│   │   ├── TextTools.tsx
│   │   └── AdBanner.tsx
│   ├── App.tsx           # 메인 앱 컴포넌트
│   ├── main.tsx          # 앱 진입점
│   └── index.css         # 글로벌 스타일
├── server/               # 백엔드 서버
│   └── server.js         # Express 서버
├── package.json          # 프로젝트 설정
├── vite.config.ts        # Vite 설정
├── tailwind.config.js    # Tailwind 설정
└── README.md            # 프로젝트 문서
```

## 🔌 API 엔드포인트

### 링크 단축 서비스
- `POST /api/shorten` - 링크 단축
- `GET /s/:code` - 단축 링크 리다이렉트
- `GET /api/analytics/:code` - 링크 분석
- `GET /api/my-links` - 사용자 링크 목록

### 유틸리티 서비스
- `POST /api/qr-generate` - QR 코드 생성
- `POST /api/generate-password` - 비밀번호 생성
- `GET /api/stats` - 전체 통계
- `GET /api/health` - 서버 상태 확인

## API 엔드포인트

**링크 단축:**
- `POST /api/shorten` - 링크 줄이기
- `GET /s/:code` - 단축 링크로 이동
- `GET /api/analytics/:code` - 클릭 통계

**기타:**
- `POST /api/qr-generate` - QR 코드 만들기
- `POST /api/generate-password` - 비밀번호 생성
- `GET /api/stats` - 전체 통계

## 환경 변수 설정 (선택사항)

실제 서비스에서 사용하려면 이런 설정들이 필요해요:

```bash
# .env 파일 만들기
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
VITE_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-your-adsense-id

# 백엔드용 (server/.env)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
PORT=5000
```

## 참고사항

**보안:**
- API 요청 제한 (Rate Limiting)
- CORS 설정
- 입력값 검증

**수익화 아이디어:**
- Google AdSense 광고
- 프리미엄 구독 (광고 제거, 무제한 사용)
- API 서비스 판매

## 라이선스

MIT License - 자유롭게 사용하세요! 