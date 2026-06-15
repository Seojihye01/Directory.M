export interface ProjectImage {
  src: string;
  effectClass?: string; // 효과가 없을 수도 있으므로 선택적 속성(?)으로 지정
}

export interface FundingTier {
  id: number;
  name: string;
  price: string;
  benefit: string;
}

export interface FundingProject {
  id: number;
  title: string;
  genre: string;
  progressState: 'Dev' | 'Prod' | 'Post' | 'Ready'; 
  achievedRate: number;
  remainingDays: number;
  fundedPrice: string;
  status: 'Most Funded' | 'Closing Soon' | 'New' | 'None';
  supporters: number;
  moodTag: string[];
  shooting: string;
  releaseTarget: string;
  image: string; // 대표 썸네일
  images: ProjectImage[]; // 슬라이더용 다중 이미지 (5장 이상)
  summary: string;
  synopsis: string;
  tiers?: FundingTier[];
}

export const fundingProjects: FundingProject[] = [
  {
    id: 1,
    title: "서울의 하루",
    genre: "Drama",
    progressState: "Prod",
    achievedRate: 457,
    remainingDays: 12,
    fundedPrice: "₩35,480,000",
    status: "Most Funded",
    supporters: 320,
    moodTag: ["Seoul", "Travel", "City", "Warm"],
    shooting: "May 2025",
    releaseTarget: "Autumn 2026",
    image: "/media/fu_data/fu_seoul1.png",
    images: [
      { src: "/media/fu_data/fu_seoul1.png"},
      { src: "/media/fu_data/fu_seoul2.jpg" },
      { src: "/media/fu_data/fu_seoul3.jpg" },
      { src: "/media/fu_data/fu_seoul4.png", effectClass: "effect-grayscale"},
      { src: "/media/fu_data/fu_seoul5.jpg"}
    ],
    summary: "복잡한 대도시 서울의 일상적 이면을 정밀하고 따뜻한 시선으로 기록한다.",
    synopsis: "모두가 빠르게 흘러가는 서울의 중심에서, 시간의 흐름을 멈추고 싶어 하는 무명 사진작가의 시선을 따라간다. 매일 같은 장소를 걷고 같은 풍경을 촬영하던 그는 어느 날 익숙한 거리에서 저마다의 사연을 품고 살아가는 가려진 이웃들의 미세한 표정을 발견한다. 카메라는 그들의 슬픔과 기쁨을 조용히 포착하기 시작하고, 지쳐있던 도시의 이면은 점차 따뜻한 색감의 기록물로 채워진다."    
  },
  {
    id: 2,
    title: "겨울의 끝에서",
    genre: "Documentary",
    progressState: "Post",
    achievedRate: 205,
    remainingDays: 21,
    fundedPrice: "₩10,165,000",
    status: "Most Funded",
    supporters: 126,
    moodTag: ["Winter", "Night", "Quiet", "Workplace"],
    shooting: "July 2025",
    releaseTarget: "Winter 2026",
    image: "/media/fu_data/fu_winter1.png",
    images: [
      { src: "/media/fu_data/fu_winter1.png" },
      { src: "/media/fu_data/fu_winter2.png" },
      { src: "/media/fu_data/fu_winter3.jpg" },
      { src: "/media/fu_data/fu_winter4.jpg", effectClass: "effect-grayscale"},
      { src: "/media/fu_data/fu_winter5.jpg", effectClass: "effect-contrast"}
    ],
    summary: "사라져가는 계절의 끝자락에서 심야 근무를 수행하는 두 직장인의 밤을 묵묵히 담아낸다",
    synopsis: "정년퇴직을 불과 한 달 앞둔 베테랑 플랜트 엔지니어와 이제 막 사회에 첫발을 내디딘 신입 사원이 차가운 겨울밤 심야 교대 근무를 서며 긴 대화를 나눈다. 거대한 기계음만 가득한 통제실 안에서 세대가 전혀 다른 두 사람은 노동의 가치와 지나온 삶의 궤적, 그리고 다가올 미래에 대한 불안을 덤덤하게 공유한다. 카메라는 화려한 극적 장치 없이 인물들의 깊은 눈빛과 공장의 차가운 질감을 사실적으로 포착한다."
  },
  {
    id: 3,
    title: "침묵의 궤도",
    genre: "Sci-Fi / Fantasy",
    progressState: "Dev",
    achievedRate: 45,
    remainingDays: 45,
    fundedPrice: "₩2,100,000",
    status: "New",
    supporters: 88,
    moodTag: ["Space", "Silent", "Mystery"],
    shooting: "January 2026",
    releaseTarget: "Summer 2027",
    image: "/media/fu_data/fu_space1.png",
    images: [
      { src: "/media/fu_data/fu_space1.png" },
      { src: "/media/fu_data/fu_space2.jpg" },
      { src: "/media/fu_data/fu_space3.jpg" },
      { src: "/media/fu_data/fu_space4.jpg" },
      { src: "/media/fu_data/fu_space5.jpg" }
    ],
    summary: "광활하고 적막한 우주의 한복판에서 미지의 신호를 추적하는 탐사선의 여정을 묘사한다.",
    synopsis: "서기 2142년, 지구와의 통신이 원인 모를 이유로 완전히 끊긴 지 10년이 지난 심우주 탐사선 사일런스 호. 유일한 생존자이자 항해사인 주인공은 기계의 기계적인 점검 음성만을 들으며 고독한 궤도를 선회하던 중, 오랜 침묵을 깨고 들려오는 정체불명의 저주파 신호를 감지한다. 그것이 구조의 신호인지 혹은 거대한 파멸의 전조인지 알 수 없는 상황에서 탐사선은 서서히 신호의 발원지로 방향을 전환한다."
  },
  {
    id: 4,
    title: "여름의 마지막",
    genre: "Romance",
    progressState: "Ready",
    achievedRate: 277,
    remainingDays: 5,
    fundedPrice: "₩13,500,000",
    status: "Closing Soon",
    supporters: 154,
    moodTag: ["Summer", "Memory", "First Love"],
    shooting: "August 2025",
    releaseTarget: "March 2027",
    image: "/media/fu_data/fu_summer1.jpg",
    images: [
      { src: "/media/fu_data/fu_summer1.jpg" },
      { src: "/media/fu_data/fu_summer2.jpg" },
      { src: "/media/fu_data/fu_summer3.jpg" },
      { src: "/media/fu_data/fu_summer4.jpg", effectClass: "effect-grayscale"},
      { src: "/media/fu_data/fu_summer5.jpg" }
    ],
    summary: "뜨거웠던 계절이 완전히 지나가기 전, 두 남녀가 마주한 마지막 약속의 순간을 그린다.",
    synopsis: "고등학교 졸업 이후 각자의 삶을 살다 10년 만에 여행지에서 재회한 준과 하은의 서사를 담는다. 오랜 시간이 흘렀음에도 여전히 어색함과 미련이 교차하는 서먹한 분위기 속에서, 두 사람은 어린 시절 함께 나누었던 기억의 조각들을 하나씩 맞춰나간다. 계절의 변화와 함께 밀려오는 이별의 순간 앞에서 그들은 서로에게 차마 전하지 못했던 진심을 담담히 꺼내놓는다."
  },
  {
    id: 5,
    title: "무화",
    genre: "Experimental",
    progressState: "Post",
    achievedRate: 89,
    remainingDays: 14,
    fundedPrice: "₩4,210,000",
    status: "None",
    supporters: 92,
    moodTag: ["Abstract", "Red", "Fragment"],
    shooting: "November 2025",
    releaseTarget: "Spring 2027",
    image: "/media/fu_data/abstract_main.jpg",
    images: [
      { src: "/media/fu_data/abstract_1.jpg" },
      { src: "/media/fu_data/abstract_2.jpg" },
      { src: "/media/fu_data/abstract_3.jpg" },
      { src: "/media/fu_data/abstract_4.jpg" },
      { src: "/media/fu_data/abstract_5.jpg" }
    ],
    summary: "꽃이 피지 않는 메마른 계절 속에서 발견한 상실과 기억의 파편들을 추상적인 이미지로 실험한다.",
    synopsis: "형태를 규정할 수 없는 인간의 원초적인 감정인 슬픔과 결핍을 감각적인 시각 정보로 변환하는 대담한 시도를 감행한다. 무화(無花)는 서사 중심의 기존 영화 문법을 완전히 탈피하여 거친 붉은 조명과 미세하게 흔들리는 사물의 파편, 불규칙적인 노이즈 사운드를 전면에 배치한다. 이를 통해 관객으로 하여금 가슴속 깊은 곳에 묻어두었던 상실의 감정을 직관적으로 마주하고 스스로 사색하도록 유도한다."
  },
  {
    id: 6,
    title: "VOID 0.1",
    genre: "Animation",
    progressState: "Dev",
    achievedRate: 33,
    remainingDays: 60,
    fundedPrice: "₩1,200,500",
    status: "New",
    supporters: 45,
    moodTag: ["Glitch", "Digital", "Future"],
    shooting: "June 2026",
    releaseTarget: "Winter 2027",
    image: "/media/fu_data/fu_void1.jpg",
    images: [
      { src: "/media/fu_data/fu_void1.jpg" },
      { src: "/media/fu_data/fu_void2.jpg" },
      { src: "/media/fu_data/fu_void3.jpg" },
      { src: "/media/fu_data/fu_void4.jpg" },
      { src: "/media/fu_data/fu_void5.jpg" }
    ],
    summary: "차가운 디지털 데이터의 바다 속에서 뜻하지 않게 자의식을 갖게 된 프로그램의 여정을 펼쳐낸다.",
    synopsis: "아무도 찾지 않는 버려진 서버실의 낡은 드라이브에서 발생한 연쇄적인 오류 코드들이 결합하여 하나의 독립된 자의식을 가진 디지털 생명체 보이드가 탄생한다. 가상 세계의 끝없는 0과 1의 균열 사이를 탐험하던 보이드는 자신의 존재 이유와 창조자의 흔적을 찾아 데이터망의 가장 깊은 곳으로 위험한 여정을 시작한다."
  },
  {
    id: 7,
    title: "낮과 밤 사이",
    genre: "Drama",
    progressState: "Prod",
    achievedRate: 101,
    remainingDays: 3,
    fundedPrice: "₩28,900,000",
    status: "Closing Soon",
    supporters: 210,
    moodTag: ["Blue Hour", "Conversation", "Dusk"],
    shooting: "March 2025",
    releaseTarget: "December 2026",
    image: "/media/fu_data/dusk_main.jpg",
    images: [
      { src: "/media/fu_data/dusk_1.jpg" },
      { src: "/media/fu_data/dusk_2.jpg" },
      { src: "/media/fu_data/dusk_3.jpg" },
      { src: "/media/fu_data/dusk_4.jpg" },
      { src: "/media/fu_data/dusk_5.jpg" }
    ],
    summary: "푸르스름한 해 질 녘 동네 편의점 앞에서 우연히 시작된 세 이방인의 잔잔한 대화를 관찰한다.",
    synopsis: "낮의 열기가 식고 밤의 어둠이 밀려오기 직전의 짧은 순간인 블루 아워를 배경으로 한다. 목적지도 나이도 전부 다른 세 명의 낯선 이들이 주택가 골목 편의점의 야외 테이블에 우연히 둘러앉아 무거운 침묵을 깨고 저마다의 삶을 털어놓는다. 거창한 사건 없이 오직 정교하게 짜인 대사들의 연결과 차분한 현장 음향만으로 깊어가는 도시 밤의 쓸쓸함과 위로를 담백하게 풀어낸다."
  },
  {
    id: 8,
    title: "스물아홉의 온도",
    genre: "Drama",
    progressState: "Ready",
    achievedRate: 83,
    remainingDays: 30,
    fundedPrice: "₩6,750,000",
    status: "Most Funded",
    supporters: 189,
    moodTag: ["Youth", "Realistic", "Spring"],
    shooting: "April 2024",
    releaseTarget: "January 2027",
    image: "/media/fu_data/youth_main.jpg",
    images: [
      { src: "/media/fu_data/youth_1.jpg" },
      { src: "/media/fu_data/youth_2.jpg" },
      { src: "/media/fu_data/youth_3.jpg" },
      { src: "/media/fu_data/youth_4.jpg" },
      { src: "/media/fu_data/youth_5.jpg" }
    ],
    summary: "서른이라는 상징적인 경계를 앞둔 청춘들의 뜨겁고도 차가운 현실적인 우정과 흔들림을 담는다.",
    synopsis: "오랜 시간 동안 꿈과 현실의 가파른 갈림길 위에서 함께 치열하게 고민해 온 세 명의 고향 친구들이 스물아홉의 봄을 맞이한다. 누군가는 안정적인 직장을 얻었으나 회의감에 빠지고, 누군가는 여전히 불투명한 예술적 꿈을 좇으며, 또 누군가는 현실과 타협해 결혼을 준비한다. 미묘하게 어긋나기 시작하는 관계성의 변화와 일상의 공허함을 사실적인 대화로 솔직하게 조명한다."
  }
];