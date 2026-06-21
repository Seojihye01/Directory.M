import React, { useState } from "react";
import './Signup_2.css';

// 1. 타입 정의 (빨간 줄 방지용)
interface FormData {
    [key: string]: string; // 인덱스 시그니처: 어떤 문자열 키로도 접근 가능하게 함
    gender: string;
    region: string;
    role: string;
    favourite: string;
}

interface Options {
    [key: string]: string[];
}

interface Signup2Props {
    onNext: () => void;
    onPrev: () => void;
}

const Signup_2: React.FC<Signup2Props> = ({ onNext, onPrev }) => {

    // 2. 상태 관리 (타입 지정)
    const [activeSelect, setActiveSelect] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        gender: '',
        region: '',
        role: '',
        favourite: ''
    });

    // 3. 드롭다운 옵션 데이터 (타입 지정)
    const options: Options = {
        gender: ['Woman', 'Man'],
        region: ['Asia', 'Europe', 'America', 'Africa', 'etc'],
        role: ['Cinephile', 'Creator', 'Critic / Curator', 'etc'],
        favourite: ['Fantasy', 'Romance', 'Action', 'Thriller', 'Documentary', 'Arthouse', 'Noir', 'Classic', 'Independent', 'etc']
    };

    // 4. 이벤트 핸들러 (매개변수 타입 지정)
    const handleSelect = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
        setActiveSelect(null); // 선택 후 드롭다운 닫기
    };

    const toggleSelect = (name: string) => {
        setActiveSelect(activeSelect === name ? null : name);
    };

    return (
        <section className="signup_container" data-theme="light">
            <div className="signup_inner">
                <div className="signup_content">
                    <div className="step">
                        <p>STEP 01</p>
                        <p className="st2">STEP 02</p>
                        <p>STEP 03</p>
                    </div>

                    <div className="input_step2">
                        {/* 닉네임 입력창 */}
                        <div className="nick">
                            <p>Nickname</p>
                            <input type="text" name="nickname" placeholder="Enter your nickname" />
                        </div>

                        {/* 옵션 기반 커스텀 드롭다운 렌더링 */}
                        {Object.keys(options).map((category) => (
                            <div className={category} key={category}>
                                <p>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                                <div className="custom_select_wrapper">
                                    <div 
                                        className={`si2_selected_box ${activeSelect === category ? 'active' : ''}`}
                                        onClick={() => toggleSelect(category)}
                                    >
                                        {/* 선택된 값이 있으면 보여주고 없으면 빈칸 */}
                                        <span>{formData[category]}</span>
                                        <div className={`arrow_icon ${activeSelect === category ? 'up' : ''}`}></div>
                                    </div>
                                    
                                    {activeSelect === category && (
                                        <ul className="options_list">
                                            {options[category].map((opt) => (
                                                <li key={opt} onClick={() => handleSelect(category, opt)}>
                                                    {opt}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="link_btn">
                        <div className="before" onClick={onPrev} style={{ cursor: 'pointer' }}>
                            <img src="/media/etc/arrow_b.svg" className="be" alt="before" />
                            <p>Before</p>
                        </div>
                        <div className="next" onClick={onNext} style={{ cursor: 'pointer' }}>
                            <p>Next</p>
                            <img src="/media/etc/arrow_b.svg" className="ar" alt="next" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup_2;