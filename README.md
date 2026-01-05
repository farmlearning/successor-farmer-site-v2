# 팜러닝 (FarmLearning)

농업 후계자 및 청년농업인을 위한 의무교육 신청 및 관리 플랫폼

## 기술 스택

- **Frontend Framework**: React 18.3.1 + TypeScript
- **Styling**: Tailwind CSS 4.1.12
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 7.11.0
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Management**: React Hook Form 7.55.0

## 프로젝트 구조

```
팜러닝/
├── src/
│   ├── app/
│   │   ├── components/       # 공통 컴포넌트
│   │   │   ├── board/       # 게시판 관련 컴포넌트
│   │   │   ├── layout/      # 레이아웃 컴포넌트
│   │   │   ├── ui/          # shadcn/ui 컴포넌트
│   │   │   └── figma/       # Figma 관련 컴포넌트
│   │   ├── layouts/         # 페이지 레이아웃
│   │   │   ├── PublicLayout.tsx    # 사용자 사이트 레이아웃
│   │   │   └── AdminLayout.tsx     # 관리자 사이트 레이아웃
│   │   ├── pages/
│   │   │   ├── public/      # 사용자 페이지
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── board/   # 게시판 (공지사항, FAQ, Q&A)
│   │   │   │   └── education/ # 교육 신청 프로세스
│   │   │   │       ├── required/  # 의무교육 (Step 1-3)
│   │   │   │       ├── general/   # 일반 후계자
│   │   │   │       └── superb/    # 우수 후계자
│   │   │   └── admin/       # 관리자 페이지
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── config/  # 환경설정
│   │   │       ├── member/  # 회원관리
│   │   │       └── instructor/ # 강사관리
│   │   └── App.tsx          # 루트 컴포넌트 + 라우팅
│   ├── styles/              # 스타일 파일
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── theme.css
│   │   └── fonts.css
│   └── main.tsx             # 엔트리 포인트
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 주요 기능

### 사용자 사이트
- **메인 페이지**: 교육 신청 안내 및 주요 정보
- **게시판**: 공지사항, FAQ, Q&A
- **교육 신청 프로세스**:
  - 청년농업인 의무교육 (Step 1-3: 권역 선택 → 연차 선택 → 신청 완료)
  - 일반 후계자 교육 신청
  - 우수 후계자 교육 신청
- **신청 내역 조회**

### 관리자 사이트
- **대시보드**: 위젯 기반 통계 및 현황
- **환경설정**: 기초 설정 관리
- **회원 관리**: 사용자 정보 관리
- **강사 관리**: 강사 정보 관리

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

또는

```bash
yarn install
```

또는

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 4. 프로덕션 미리보기

```bash
npm run preview
```

## 주요 라우트

### 사용자 사이트
- `/` - 메인 페이지
- `/board/notice` - 공지사항
- `/board/qna` - Q&A
- `/board/faq` - FAQ
- `/education/check` - 신청 내역 조회
- `/education/required/step1` - 의무교육 신청 (권역 선택)
- `/education/required/step2` - 의무교육 신청 (연차 선택)
- `/education/required/step3` - 의무교육 신청 (신청서 작성)
- `/education/general/apply` - 일반 후계자 교육 신청
- `/education/superb/apply` - 우수 후계자 교육 신청

### 관리자 사이트
- `/admin/dashboard` - 관리자 대시보드
- `/admin/config/base` - 기초 설정
- `/admin/member/list` - 회원 관리
- `/admin/instructors` - 강사 관리

## 개발 가이드

### Tailwind CSS 4.0 사용
이 프로젝트는 Tailwind CSS 4.0을 사용합니다. `@tailwindcss/vite` 플러그인이 자동으로 PostCSS를 설정하므로 별도의 `tailwind.config.js` 파일은 필요하지 않습니다.

### 컴포넌트 추가
새로운 컴포넌트는 `/src/app/components` 디렉토리에 추가하고, 페이지는 `/src/app/pages` 디렉토리에 추가합니다.

### 라우팅
`/src/app/App.tsx`에서 React Router DOM을 사용하여 라우팅을 관리합니다.

## 주의사항

- 이 프로젝트는 프론트엔드 전용입니다. 백엔드 연동이 필요한 경우 API 엔드포인트를 설정해야 합니다.
- 현재는 목(mock) 데이터를 사용하고 있으며, 실제 API 연동 시 데이터 페칭 로직을 추가해야 합니다.

## 라이선스

Private

## 문의

프로젝트 관련 문의사항은 이슈를 등록해 주세요.
