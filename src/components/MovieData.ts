export interface Movie {
    id: number | string;
    title: string;
    subTitle: string;
    direc: string;      // 감독
    rel: string;        // 개봉 연도
    img: string;        // 포스터 이미지
    className: string;  // 기존 레이아웃용 클래스명
    desc: string;       // 짧은 요약 (카드용)
    synopsis: string;   // 상세 줄거리 (모달용)
    runtime: string;    // 상영 시간
    actors: string[];   // 출연 배우
    trailerUrl: string; // YouTube Embed 링크
    videoUrl?: string;
    relatedMovies: number[]; // 관련 영화 ID 배열
    category?: string[];
    genre: "Sci-Fi" | "Drama" | "Action" | "Thriller" | "Fantasy" | "History" | "Animation" | "Comedy" | "Documentary" | "Romance" | "Noir" | "Arthouse" | "Classic" | "Independent";
    age: string;
    symbol?: string;
}

export const allMovies: Movie[] = [
    { 
        id: 1, title: "Dune", subTitle: "사막의 지평선과 거대한 함선이 만드는 시각적 극점",
        direc: "Denis Villeneuve", rel: "2021", runtime: "2h 35m",
        img: "/media/dune2.jpg", className: "cu1_set1",
        desc: "끝없는 모래 사막과 적막한 대기 속에 감도는 정적이고 묵직한 중량감을 구현한다.",
        synopsis: "우주에서 가장 귀한 자원인 스파이스를 둘러싼 가문 간의 전쟁, 그리고 그 속에서 각성하는 폴 아트레이데스의 여정을 그린 SF 대서사시이다. 사막의 광활함, 거대한 우주선의 기하학적 형태, 그리고 빛과 그림자의 극단적인 대비를 활용하여 인물들이 마주한 운명의 무게를 시각적으로 압도하듯 정제하여 연출했다.",
        actors: ["Timothée Chalamet", "Rebecca Ferguson"],
        trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4",
        videoUrl: "/media/Dune_ex.mp4",
        relatedMovies: [3, 6, 12],
        genre: "Sci-Fi",
        age: "12",
        symbol: "/media/Curation/dune_symbol.mp4"
    },
    { 
        id: 2, title: "Gravity", subTitle: "흑백의 우주 속 절대적 고독",
        direc: "Alfonso Cuarón", rel: "2013", runtime: "1h 31m",
        img: "/media/gravity.jpg", className: "cu3_set2",
        desc: "아무런 소리도 존재하지 않는 우주에서 오직 생존을 위해 움직이는 인간의 찰나를 다룬다.",
        synopsis: "허블 우주망원경을 수리하던 중 폭파된 위성 잔해와 충돌하며 우주 한복판에 홀로 남겨진 라이언 스톤 박사의 기록이다. 영화는 롱테이크 기법을 극한으로 활용하여 지구의 아름다운 곡선과 우주의 어두운 심연을 한 프레임에 담아낸다. 소리가 차단된 진공 상태 속에서 인물의 거친 호흡과 메탈릭한 우주선의 질감만을 남겨 고독과 생존 의지를 시각화했다.",
        actors: ["Sandra Bullock", "George Clooney"],
        trailerUrl: "https://www.youtube.com/embed/OiTiKOy59o4",
        relatedMovies: [4, 11, 12],
        genre: "Sci-Fi",
        age: "12",
        symbol: "/media/Curation/gravity_.mp4"
    },
    { 
        id: 3, title: "Blade Runner 2049", subTitle: "안개와 네온이 빚어낸 디스토피아",
        direc: "Denis Villeneuve", rel: "2017", runtime: "2h 44m",
        img: "/media/blade_runner_2049.jpg", className: "cu3_set3",
        desc: "인간성과 복제인간의 경계를 허무는 날카로운 질문과 탐미적인 미장센을 스크린에 투영했다.",
        synopsis: "인간과 복제인간이 혼재된 2049년, 새로운 블레이드 러너 'K'가 사회의 질서를 무너뜨릴 수 있는 오랜 비밀을 마주하며 시작된다. 로저 디킨스 촬영 감독이 완성한 안개와 거대한 홀로그램, 그리고 오렌지빛으로 물든 사막의 폐허는 디스토피아적 미래를 차갑고도 탐미적인 프레임으로 직조해 내며 인간의 본질에 대한 고독한 사유를 이끌어낸다.",        
        actors: ["Ryan Gosling", "Harrison Ford"],
        trailerUrl: "https://www.youtube.com/embed/gCcx85zbxz4",
        relatedMovies: [1, 5, 6],
        genre: "Sci-Fi",
        age: "15",
        symbol: "/media/Curation/blade_symbol_.mp4"
    },
    { 
        id: 4, title: "Interstellar", subTitle: "차원을 넘나드는 시간과 사랑의 물리학",
        direc: "Christopher Nolan", rel: "2014", runtime: "2h 49m",
        img: "/media/interstellar2.jpg", className: "cu3_set4",
        desc: "물리학적 이론을 바탕으로 시공간의 왜곡을 구현하여 장엄한 우주의 시각적 서사와 인류의 희망을 선보인다.",
        synopsis: "세계적인 식량 위기와 기후 변화로 파멸해 가는 지구를 구하기 위해 시공간의 한계를 넘어 블랙홀 너머의 새로운 행성을 찾아 나서는 탐사대원들의 기록이다. 아인슈타인의 일반상대성 이론을 시각적으로 고증한 웜홀과 가르간튀아 블랙홀의 장엄한 비주얼, 그리고 5차원의 공간을 3차원의 스크린 위에 구현한 연출은 우주의 심연과 인류의 유대감을 깊이 있게 연결한다.",
        actors: ["Matthew McConaughey", "Anne Hathaway"],
        trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
        relatedMovies: [2, 5, 12],
        genre: "Sci-Fi",
        age: "12",
        symbol: "/media/Curation/interstellar2_symbol.mp4"
    },
    { 
    id: 5, title: "Black Swan", subTitle: "완벽을 향한 갈망이 빚어낸 탐미적 파멸",
    direc: "Darren Aronofsky", rel: "2010", runtime: "1h 48m",
    img: "/media/black_swan.jpg", className: "cu3_set5",
    desc: "순수함의 상징인 백조가 내면의 어두운 욕망을 투영한 흑조로 변화하는 잔혹한 무대를 연출했다.",
    synopsis: "뉴욕 발레단의 '백조의 호수' 오프닝 무대에서 백조와 흑조 1인 2역을 맡게 된 발레리나 니나. 핸드헬드 카메라의 흔들리는 무빙과 무대 위 거울의 파편들을 이용해 완벽에 도달하고자 하는 인간의 예술적 광기를 날카롭게 포착했다. 조명과 의상의 극단적인 흑백 대조를 통해 자아의 붕괴를 감각적으로 증명한다.",
    actors: ["Natalie Portman", "Mila Kunis"],
    trailerUrl: "https://www.youtube.com/embed/5jaI1XOB-bs",
    relatedMovies: [10, 11, 15], 
    genre: "Thriller",
    age: "19",
    symbol: "/media/Curation/swan2_symbol.mp4"
    },
    { 
        id: 6, title: "2001: A Space Odyssey", subTitle: "인류의 기원과 우주적 경외의 시각적 서사시",
        direc: "Stanley Kubrick", rel: "1968", runtime: "2h 29m",
        img: "/media/2001.jpg", className: "cu3_set6",
        desc: "컴퓨터 그래픽이 없던 시대에 오직 정교한 세트와 구도만으로 우주적 숭고미를 완성했다.",
        synopsis: "인류 문명의 시작점에 등장한 의문의 검은 비석 '모놀리스'의 비밀을 풀기 위해 목성으로 향하는 디스커버리호의 여정을 그렸다. 스탠리 큐브릭 감독은 클래식 음악의 선율과 완벽한 좌우 대칭의 프레임, 그리고 극단적인 미니멀리즘 세트 디자인을 결합했다. 인공지능 HAL 9000과의 대립과 우주의 침묵을 스크린 위에 철학적이고도 정적인 미학으로 구현했다.",
        actors: ["Keir Dullea", "Gary Lockwood"],
        trailerUrl: "https://www.youtube.com/embed/oR_e9y-bka0",
        relatedMovies: [1, 3, 12],
        genre: "Sci-Fi",
        age: "All",
        symbol: "/media/Curation/2001_symbol.mp4"
    },
    { 
        id: 7, title: "Mad Max : Fury Road", subTitle: "붉은 사막 위를 질주하는 광기",
        direc: "George Miller", rel: "2015", runtime: "2h 0m",
        img: "/media/mad_max.jpg", className: "cu3_set7",
        desc: "가공되지 않은 실제 차량 액션과 거친 사막의 질감을 프레임 가득 채워 질주감을 선사한다.",
        synopsis: "핵전쟁으로 멸망한 22세기. 얼마 남지 않은 물과 기름을 독점한 독재자 임모탄 조의 지배에 맞서 진정한 자유의 공간으로 탈출하려는 맥스와 사령관 퓨리오사의 사투이다. 영화는 컴퓨터 그래픽을 최소화한 아날로그 액션과 스릴러적 긴장감을 결합하였고 낮의 강렬한 오렌지빛 사막과 밤의 푸른 대조를 통해 황량한 세계관의 비주얼을 감각적으로 시각화했다.",
        actors: ["Tom Hardy", "Charlize Theron"],
        trailerUrl: "https://www.youtube.com/embed/hEJnMQG9ev8",
        relatedMovies: [1, 9, 17],
        genre: "Action",
        age: "15",
        symbol: "/media/Curation/max_symbol.mp4"
    },
    { 
        id: 8, title: "Dunkirk", subTitle: "생존의 시간이 빚어낸 긴박함",
        direc: "Christopher Nolan", rel: "2017", runtime: "1h 46m",
        img: "/media/dunkirk.jpg", className: "cu3_set8",
        desc: "해변의 일주일, 바다의 하루, 하늘의 한 시간이라는 정교한 시간의 레이어를 시각화했다.",
        synopsis: "제2차 세계대전 당시 프랑스 덩케르크 해안에 고립된 40만 명의 연합군을 영국 본토로 철수시키기 위해 감행된 실화를 다룬다. 하늘과 바다, 그리고 모래사장이라는 세 가지 공간과 서로 다르게 흐르는 세 개의 시간대를 교차 편집하여 오직 카메라 프레임과 한스 짐머의 셰퍼드 톤 음향만으로 인간이 느끼는 생존의 타이트한 긴박감을 조명했다.",
        actors: ["Fionn Whitehead", "Tom Hardy"],
        trailerUrl: "https://www.youtube.com/embed/F-eMt3SrfFU",
        relatedMovies: [4, 5, 9],
        genre: "History",
        age: "12",
        symbol: "/media/Curation/dunkirk2_symbol.mp4"
    },
    { 
        id: 9, title: "The Matrix", subTitle: "시간을 멈춘 불릿 타임, 감각이 마비된 가상의 기록",
        direc: "Lana Wachowski, Lilly Wachowski", rel: "1999", runtime: "2h 16m",
        img: "/media/matrix.jpg", className: "cu3_set9",
        desc: "서사의 흐름을 정지시키고 찰나의 역동적 미학을 정립했다.",
        synopsis: "평범한 회사원 네오가 인간의 기억을 지배하고 있는 가상현실 시스템 '매트릭스'의 실체를 자각하고 인류를 해방하기 위한 전쟁에 참여하는 구조다. 진실을 선택한 그는 시간을 초월한 초감각적 각성을 통해 시스템의 질서에 정면으로 맞선다. 카메라 수십 대를 동원해 시간의 흐름을 멈추고 공간의 축만을 이동시키는 '불릿 타임(Bullet Time)' 기법과 특유의 서늘한 초록빛 톤 미장센을 도입하여 SF 영화가 보여줄 수 있는 시각적 패러다임을 바꾼 디지털 연대기다.",
        actors: ["Keir Dullea", "Gary Lockwood"],
        trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
        relatedMovies: [1, 3, 4],
        genre: "Sci-Fi",
        age: "15",
        symbol: "/media/Curation/matrix2_symbol.mp4"
    },
    { 
        id: 10, title: "Whiplash", subTitle: "드럼 스네어 위 열망과 광기가 충돌하는 완벽한 리듬",
        direc: "Damien Chazelle", rel: "2014", runtime: "1h 46m",
        img: "/media/whiplash.jpg", className: "cu3_set10",
        desc: "한계를 넘어선 집착이 빚어낸 전율의 피날레와 두 인물이 빚어내는 심리적 균열과 폭발을 포착한다.",
        synopsis: "뉴욕 최고의 음악 학교에 입학한 신입 드러머 앤드류와 그의 한계를 끌어내기 위해 가혹한 심리적 폭언과 압박을 서슴지 않는 플레처 교수 사이의 파멸적 앙상블을 다룬다. 영화는 음악적 화려함 대신 심벌즈와 스네어 드럼을 클로즈업하는 타이트한 카메라 웍과, 연주자의 땀과 피가 튀는 순간을 클로즈업했다. 1초 단위로 쪼개지는 칼날 같은 편집을 통해 듣는 음악을 보는 미학으로 치환했다.",
        actors: ["Miles Teller", "J.K. Simmons"],
        trailerUrl: "https://www.youtube.com/embed/Q7kZy3T6vRM?si=F4j5kNfboV9ftoFl",
        relatedMovies: [3, 14, 15],
        genre: "Drama",
        age: "15",
        symbol: "/media/Curation/whiplash_symbol.mp4"
    },
    { 
        id: 11, title: "Project Hail Mary", subTitle: "인류를 구하기 위한 외로운 우주 비행",
        direc: "Phil Lord, Christopher Miller", rel: "2026", runtime: "2h 36m",
        img: "/media/hailmary.png", className: "ex_set11",
        desc: "기억을 잃은 채 머나먼 우주선에서 홀로 깨어난 과학자가 기억을 되찾으며 벌이는 우주적 사투를 보인다.",
        synopsis: "인류를 멸망으로 이끄는 태양 에너지 소멸 현상을 해결하기 위해 외우주로 파견되었으나, 동면 부작용으로 기억을 완전히 잃은 채 깨어난 과학자 라일랜드 그레이스의 단독 미션이다. 폐쇄된 우주선 내부의 금속 질감과 슬라이딩 패널, 그리고 점진적으로 복원되는 과거 기억의 파편들을 교차 연출했다. 정교한 하드 SF의 문법과 미니멀한 공간 레이아웃을 스크린 위에 구현했다.",
        actors: ["Ryan Gosling", "Sandra Bullock"],
        trailerUrl: "https://www.youtube.com/embed/m08TxIsFTRI?si=dXCxS9F31MCvXzfV",
        relatedMovies: [2, 4, 12],
        category: ["top 5", "new"],
        genre: "Sci-Fi",
        age: "12"
    },
    { 
        id: 12, title: "The Martian", subTitle: "붉은 토양과 하얀 베이스캠프의 완벽한 기능주의",
        direc: "Ridley Scott", rel: "2015", runtime: "2h 24m",
        img: "/media/martian.jpg", className: "ex_set12",
        desc: "화성에 거친 모래 폭풍 속에 남겨진 한 인간의 생존 과정을 이성적이고 사실적으로 담았다.",
        synopsis: "모래 폭풍으로 인해 화성에 홀로 낙오된 식물학자 마크 와트니가 자신의 지식을 활용해 기지 내부에 감자 재배 시설을 구축하고 생존하는 과정을 담았다. 감독 리들리 스콧은 화성의 붉고 황량한 자연풍경과 인간이 설계한 가장 기능적이고 인공적인 하얀색 베이스캠프 구조를 대비시킨다. 이성적인 과학적 추론 과정을 깔끔한 구도의 롱테이크 프레임으로 정돈해 냈다.",
        actors: ["Matt Damon", "Jessica Chastain"],
        trailerUrl: "https://www.youtube.com/embed/ej3ioOneTy8",
        relatedMovies: [2, 4, 11],
        category: ["like", "view"],
        genre: "Sci-Fi",
        age: "12"
    },
    { 
        id: 13, title: "007 Spectre", subTitle: "거대 조직 스펙터와 제임스 본드의 대결",
        direc: "Sam Mendes", rel: "2015", runtime: "2h 28m",
        img: "/media/007.jpg", className: "ex_set13",
        desc: "베일에 싸인 거대 조직 스펙터의 실체와 제임스 본드의 과거를 추적하는 정교한 미장센이다.",
        synopsis: "멕시코시티의 '죽은 자들의 날' 축제 한복판에서 벌어지는 정교한 오프닝 롱테이크 시퀀스를 지나, 과거의 비밀과 직결된 거대 범죄 조직 '스펙터'의 정점을 찾아 나서는 첩보 서사다. 샘 멘데스 감독 특유의 대칭 구도와 정돈된 색조, 이탈리아 로마의 고풍스럽고 차가운 밤거리를 활용했다. 클래식 스파이물의 전통적인 품격을 시각적 균형미로 해석하여 전개한다.",
        actors: ["Daniel Craig", "Léa Seydoux"],
        trailerUrl: "https://www.youtube.com/embed/ujmoYyEyDP8?si=TIrxK3ka7pxNiaEE",
        relatedMovies: [5, 7, 17],
        category: ["view"],
        genre: "Action",
        age: "15"
    },
    { 
        id: 14, title: "The Grand Budapest Hotel", subTitle: "환상적인 색채 속에 감춰진 미스터리",
        direc: "Wes Anderson", rel: "2014", runtime: "1h 40m",
        img: "/media/budapest.jpg", className: "ex_set14",
        desc: "최고의 컨시어지와 로비 보이의 기상천외한 모험을 고스란히 담았다.",
        synopsis: "세계 대전의 전운이 감도는 가상의 국가 주브로브카 공화국에 위치한 그랜드 부다페스트 호텔의 전설적인 컨시어지 구스타브와 로비 보이 제로가 명화 도난 사건에 휘말리며 벌어지는 미스터리한 소동극입니다. 웨스 앤더슨 감독은 각 시대상을 반영하는 프레임의 크기로 정교하게 전환되는 화면비와 파스텔 컬러 플레이를 통해 연출력을 증명한다.",
        actors: ["Ralph Fiennes", "Tony Revolori"],
        trailerUrl: "https://www.youtube.com/embed/1Fg5iWmQjwk",
        relatedMovies: [10, 15, 16],
        category: ["like"],
        genre: "Comedy",
        age: "15"
    },
    { 
        id: 15, title: "The French Dispatch", subTitle: "찬란하게 빛나는 마지막 호의 기사들",
        direc: "Wes Anderson", rel: "2021", runtime: "1h 48m",
        img: "/media/french_1.png", className: "ex_set15",
        desc: "20세기 저널리즘의 구조를 가상 잡지사 프렌치 디스패치의 세 가지 형식으로 시각화했다.",
        synopsis: "20세기 후반 프랑스의 한 가상 도시에 위치한 미국 잡지사 '프렌치 디스패치'의 편집장 죽음 이후, 그의 추모 호이자 최종 발행본에 실릴 세 가지 기사를 옴니버스 형식으로 구성했다. 한 페이지의 잡지를 읽는 듯한 철저한 그리드 시스템과 흑백과 컬러의 결합을 통해 매력적인 기사를 화려한 미장센으로 엮어냈다.",
        actors: ["Bill Murray", "Tilda Swinton"],
        trailerUrl: "https://www.youtube.com/embed/TcPk2p0Zaw4",
        relatedMovies: [10, 14, 16],
        category: ["like"],
        genre: "Drama",
        age: "15"
    },
    { 
        id: 16, title: "Paddington", subTitle: "런던에 도착한 사랑스러운 꼬마 곰",
        direc: "Paul King", rel: "2014", runtime: "1h 35m",
        img: "/media/london.jpg", className: "ex_set16",
        desc: "실수투성이지만 거부할 수 없는 패딩턴의 적응기를 실사와 애니메이션의 정교한 합성 기술로 아날로그 런던의 미학을 완성했다.",
        synopsis: "새로운 가족을 찾기 위해 페루의 숲에서 무작정 영국 런던으로 상경한 말하는 꼬마 곰 패딩턴이 브라운 가족을 만나면서 펼쳐지는 일상적인 사건들을 다룬다. 영화는 영국의 클래식한 건축 양식, 브라운 가옥 내부의 나선형 계단과 동화적인 인테리어 소품 배치를 특징으로 삼았다. 따뜻하고 정돈된 색감의 카메라 톤을 기반으로 인물의 동작을 기하학적으로 배치해 시각적 편안함을 준다.",
        actors: ["Ben Whishaw", "Hugh Bonneville"],
        trailerUrl: "https://www.youtube.com/embed/7bZFr2IA0Bo",
        relatedMovies: [12, 14, 15],
        category: ["view"], 
        genre: "Animation",
        age: "All"
    },
    { 
        id: 17, title: "Escape Room", subTitle: "살아남기 위해선 정답을 찾아야 한다",
        direc: "Adam Robitel", rel: "2019", runtime: "1h 40m",
        img: "/media/escaperoom.jpg", className: "ex_set17",
        desc: "각 방이 가진 테마와 시각적 기믹을 통해 인물들의 심리적 사투를 조명한다.",
        synopsis: "초대장을 받고 거액의 상금이 걸린 방탈출 게임에 참여한 6명의 참가자가 마주하는 죽음의 공간들을 다룬다. 영화는 거꾸로 뒤집힌 거실, 얼어붙은 호수, 거대한 화로 등 방 자체가 하나의 거대한 시각적 캐릭터로 기능하도록 설계했다. 폐쇄적인 프레임과 사선 앵글, 그리고 왜곡된 렌즈 효과를 사용하여 공간이 인간을 압박해 들어오는 심리적 과정을 구조적으로 연출했다.",
        actors: ["Taylor Russell", "Logan Miller"],
        trailerUrl: "https://www.youtube.com/embed/6dSKUoV0SNI?si=_F9aDqN0j7OwNXoi",
        relatedMovies: [7, 9, 13],
        category: ["like", "view"],
        genre: "Thriller",
        age: "15"
    },
    { 
        id: 18, title: "TENET", subTitle: "순방향과 역방향의 흐름이 한 프레임에 교차하는 인버전의 미학",
        direc: "Christopher Nolan", rel: "2020", runtime: "2h 30m",
        img: "/media/tenet.jpg", className: "cu3_set18",
        desc: "시간의 흐름을 뒤집는 물리적 법칙을 한 화면에 담아 시각적 혁명을 완성했다.",
        synopsis: "시간의 흐름을 되돌리는 미래 기술 '인버전'을 이용해 현재의 세계를 파괴하려는 세력에 맞서 제3차 세계대전을 막기 위해 투입된 비밀 요원의 서사다. 크리스토퍼 놀란 감독은 시간이 정방향으로 흐르는 인물과 역방향으로 흐르는 인물이 같은 공간에서 격돌하는 물리적 모순을 시각화했다. 전후방 카메라 무빙과 역재생 편집 기술을 영리하게 결합하여 프레임 자체의 논리를 뒤흔드는 시각적 충격을 보여준다.",
        actors: ["John David Washington", "Robert Pattinson"],
        trailerUrl: "https://www.youtube.com/embed/LdOM0x0XDMo?si=_miJBrTblvhyTOcd",
        relatedMovies: [3, 4, 8],
        genre: "Sci-Fi",
        age: "12"
    }
];