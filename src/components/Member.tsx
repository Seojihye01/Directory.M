import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Member.css';

interface PricingProps {
  isLoggedIn: boolean;
}

interface PlanItem {
  id: string;
  name: string;
  price: string;
  features: string[];
}

const Member: React.FC<PricingProps> = ({ isLoggedIn }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentPlan] = useState<string>('pro');
  const nextBillingDate = '26.08.21';

  // 모바일 아코디언 개폐 상태 (기본적으로 접힌 상태)
  const [expandedPlans, setExpandedPlans] = useState<{ [key: string]: boolean }>({});

  // 모달 상태
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{ title: string; desc: string }>({ title: '', desc: '' });

  // 모바일 아코디언 토글 함수
  const togglePlanFeatures = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  // 요금제 데이터
  const plansData: PlanItem[] = [
    {
      id: 'basic',
      name: t('pricing.plans.basic.name'),
      price: '₩9,900',
      features: [
        t('pricing.plans.basic.f1'),
        t('pricing.plans.basic.f2'),
        t('pricing.plans.basic.f3')
      ]
    },
    {
      id: 'pro',
      name: t('pricing.plans.pro.name'),
      price: '₩12,900',
      features: [
        t('pricing.plans.pro.f1'),
        t('pricing.plans.pro.f2'),
        t('pricing.plans.pro.f3')
      ]
    },
    {
      id: 'premium',
      name: t('pricing.plans.premium.name'),
      price: '₩19,900',
      features: [
        t('pricing.plans.premium.f1'),
        t('pricing.plans.premium.f2'),
        t('pricing.plans.premium.f3'),
        t('pricing.plans.premium.f4')
      ]
    }
  ];

  // 카드 클릭 시 모달 열기
  const handleCardButtonClick = (plan: PlanItem) => {
    let title = '';
    let desc = '';

    if (!isLoggedIn) {
      title = t('pricing.modal.selectTitle');
      desc = t('pricing.modal.selectDesc', { plan: plan.name });
    } else {
      if (plan.id === currentPlan) {
        title = t('pricing.modal.extendTitle');
        desc = t('pricing.modal.extendDesc', { plan: plan.name });
      } else {
        title = t('pricing.modal.changeTitle');
        desc = t('pricing.modal.changeDesc', { plan: plan.name });
      }
    }

    setModalData({ title, desc });
    setModalOpen(true);
  };

  // 하단 배너 클릭 핸들러
  const handleBannerClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/mypage');
    }
  };

  return (
    <div className="pricing_page" data-theme="light">
      <h1 className="pricing_title">{t('pricing.title')}</h1>

      {/* 요금제 카드 리스트 */}
      <div className="cards_container">
        {plansData.map((plan) => {
          const isSelected = isLoggedIn && plan.id === currentPlan;
          const isExpanded = !!expandedPlans[plan.id];

          let btnText = t('pricing.btn.select');
          if (isLoggedIn) {
            btnText = isSelected ? t('pricing.btn.extension') : t('pricing.btn.change');
          }

          return (
            <div
              key={plan.id}
              className={`price_card ${isSelected ? 'selected' : ''}`}
            >
              <div className="card_header">
                <span className="plan_name">{plan.name}</span>
                <span className="plan_price">{plan.price}/{t('pricing.month')}</span>
              </div>

              {/* 모바일 전용 토글 화살표 버튼 */}
              <button 
                className="toggle_features_btn" 
                onClick={() => togglePlanFeatures(plan.id)}
                aria-label="Toggle Details"
              >
                <span>Details</span>
                <img src="/media/etc/arrow_b.svg" alt="" className={`mem_arrow_icon ${isExpanded ? 'open' : ''}`} />
              </button>

              <div className="card_divider" />

              {/* 모바일에서는 isExpanded 상태에 따라 토글됨 */}
              <div className={`features_wrapper ${isExpanded ? 'expanded' : ''}`}>
                <ul className="feature_list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              <button
                className={`card_btn ${isSelected ? 'active_btn' : ''}`}
                onClick={() => handleCardButtonClick(plan)}
              >
                {btnText}
              </button>
            </div>
          );
        })}
      </div>

      {/* 하단 대시보드 배너 */}
      <div className="bottom_banner" onClick={handleBannerClick} style={{ cursor: 'pointer' }}>
        {!isLoggedIn ? (
          <div className="banner_content center">{t('pricing.loginToPay')}</div>
        ) : (
          <div className="banner_content between">
            <span>
              {t('pricing.myMembership')} : <strong>{plansData.find(p => p.id === currentPlan)?.name}</strong>
            </span>
            <span className="date_text">
              {t('pricing.nextPayDate')} : {nextBillingDate}
            </span>
          </div>
        )}
      </div>

      {/* 모달 창 */}
      {modalOpen && (
        <div className="modal_overlay" onClick={() => setModalOpen(false)}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal_x_btn" onClick={() => setModalOpen(false)} aria-label="Close">
              &times;
            </button>

            <div className="modal_header">
              <h3>{modalData.title}</h3>
            </div>
            
            <div className="modal_body">
              <p>{modalData.desc}</p>
            </div>

            <div className="modal_actions">
              <button className="modal_confirm_btn" onClick={() => setModalOpen(false)}>
                {t('pricing.btn.confirm')}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Member;