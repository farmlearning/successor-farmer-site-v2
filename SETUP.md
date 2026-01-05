# 팜러닝 로컬 개발 가이드

## 빠른 시작

### 1. 프로젝트 클론 또는 압축 해제

프로젝트를 다운로드한 후 원하는 디렉토리에 압축을 해제합니다.

### 2. 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
npm install
```

> **참고**: npm 대신 yarn 또는 pnpm을 사용할 수도 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하면 애플리케이션을 확인할 수 있습니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

## 문제 해결

### 포트 충돌
만약 5173 포트가 이미 사용 중이라면, Vite가 자동으로 다른 포트를 사용합니다. 터미널에 표시된 URL을 확인하세요.

### 의존성 오류
의존성 설치 중 오류가 발생하면 다음을 시도해보세요:

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 타입스크립트 오류
TypeScript 관련 오류가 발생하면 IDE를 재시작하거나 다음 명령어를 실행하세요:

```bash
# TypeScript 캐시 정리
rm -rf node_modules/.vite
npm run dev
```

## 추가 설정

### 환경 변수
필요한 경우 프로젝트 루트에 `.env` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```env
VITE_API_URL=http://localhost:3000/api
```

코드에서는 다음과 같이 사용합니다:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### API 연동
현재는 목(mock) 데이터를 사용하고 있습니다. 실제 백엔드 API와 연동하려면:

1. API 클라이언트 라이브러리 설치 (예: axios)
2. API 호출 함수 작성
3. 각 페이지에서 mock 데이터를 API 호출로 교체

## 디렉토리 구조

```
팜러닝/
├── src/
│   ├── app/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── layouts/       # 페이지 레이아웃
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── App.tsx        # 라우팅 설정
│   ├── styles/            # CSS 파일
│   └── main.tsx           # 엔트리 포인트
├── public/                # 정적 파일
├── index.html             # HTML 템플릿
├── package.json           # 프로젝트 설정
├── tsconfig.json          # TypeScript 설정
├── vite.config.ts         # Vite 설정
└── README.md              # 프로젝트 문서
```

## 개발 팁

1. **Hot Module Replacement (HMR)**: 파일을 저장하면 자동으로 브라우저가 업데이트됩니다.
2. **TypeScript**: 타입 안정성을 위해 적극적으로 타입을 정의하세요.
3. **컴포넌트 분리**: 재사용 가능한 컴포넌트는 `/src/app/components`에 작성하세요.
4. **Tailwind CSS**: 유틸리티 클래스를 사용하여 스타일링하세요.

## 배포

### Vercel 배포
```bash
npm install -g vercel
vercel
```

### Netlify 배포
```bash
npm install -g netlify-cli
netlify deploy
```

### 일반 서버 배포
1. `npm run build`로 프로덕션 빌드
2. `dist` 폴더의 내용을 서버에 업로드
3. 웹 서버에서 `index.html`을 제공하도록 설정

## 추가 정보

더 자세한 내용은 `README.md` 파일을 참조하세요.
