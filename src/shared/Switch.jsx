import React from 'react';


function Switch({ onToggle, isChecked, label }) {
    return (
        <label className="toggle">
            <input className="toggle__checkbox" type="checkbox" onChange={onToggle} checked={isChecked} />
            <div className="toggle__switch"></div>
            <span className="toggle__label">{label}</span>
        </label>
    )
}

export default Switch;