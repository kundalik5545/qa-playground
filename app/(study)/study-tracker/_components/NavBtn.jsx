import React from "react";

const NavBtn = ({ id, label, icon, active, onClick, badge, badgeStyle }) => {
  return (
    <div>
      <li>
        <button
          className={`st-nav-btn${active === id ? " active" : ""}`}
          onClick={() => onClick(id)}
        >
          <span className="st-nav-icon">{icon}</span>
          <span className="st-nav-label">{label}</span>
          {badge && (
            <span className="st-nav-badge" style={badgeStyle}>
              {badge}
            </span>
          )}
        </button>
      </li>
    </div>
  );
};

export default NavBtn;
