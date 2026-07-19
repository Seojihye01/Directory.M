import React from 'react';
import './Member.css';

const Membership: React.FC = () => {
  return (
    <div className="pricing_container">
      <div className="pricing_header">
        <h2>Pricing Plans</h2>
        <p>Choose the right plan for your cinema life.</p>
      </div>

      {/* 카드 래퍼 - 템플릿처럼 2개의 카드를 배치 */}
      <div className="pricing_cards_wrapper">
        
        {/* SILVER CARD (Monthly) */}
        <div className="pricing_card">
          <div className="card_top_section">
            <span className="badge">SILVER</span>
            <div className="price_title">
              <span className="amount">$9</span>
              <span className="period">/month</span>
            </div>
            <p className="card_desc">Perfect for monthly cinephiles</p>
            <button className="pricing_cta_btn">Get Started</button>
          </div>
          <div className="card_bottom_section">
            <ul className="feature_list">
              <li>✓ Unlimited Archiving for 1 Month</li>
              <li>✓ Stage 3 Custom Ticket Prints</li>
              <li>✓ Access to Exclusive Creator Fonts</li>
              <li>✓ High-Resolution Downloads</li>
            </ul>
          </div>
        </div>

        {/* PLATINUM CARD (Yearly) - 템플릿의 PROFESSIONAL처럼 연한 블루 하이라이트 배경 적용 */}
        <div className="pricing_card featured">
          <div className="card_top_section">
            <span className="badge">PLATINUM</span>
            <div className="price_title">
              <span className="amount">$89</span>
              <span className="period">/year</span>
            </div>
            <p className="card_desc">Best value for full-year creators</p>
            <button className="pricing_cta_btn">Get Started</button>
          </div>
          <div className="card_bottom_section">
            <ul className="feature_list">
              <li>✓ Unlimited Archiving for 1 Year</li>
              <li>✓ Stage 3 Custom Ticket Prints</li>
              <li>✓ Access to Exclusive Creator Fonts</li>
              <li>✓ High-Resolution Downloads</li>
            </ul>
          </div>
        </div>

      </div>

      {/* 하단 정책 안내 영역 */}
      <div className="pricing_policy_section">
        <div className="policy_item">
          <h4>결제 및 자동 갱신</h4>
          <p>모든 멤버십은 선택하신 주기(월간/연간)에 따라 자동 결제되며, 마이페이지 계정 설정에서 언제든지 해지하실 수 있습니다.</p>
        </div>
        <div className="policy_item">
          <h4>취소 및 환불 정책</h4>
          <p>결제 후 7일 이내에 컨텐츠 시청, 티켓 이미지 다운로드 등의 이용 이력이 없는 경우 100% 환불이 가능합니다. 기간 경과 후 해지 시에는 다음 결제일부터 청구되지 않습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Membership;