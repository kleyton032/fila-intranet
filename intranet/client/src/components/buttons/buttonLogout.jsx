import React from 'react';

const ButtonLogout = ({ type, onClick, label }) => {
    return (
        <div>
            <button type={type} onClick={onClick}>
                {label}
            </button>
        </div>
    )
}

export default ButtonLogout;