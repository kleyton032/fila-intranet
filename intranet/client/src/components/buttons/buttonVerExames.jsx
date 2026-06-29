import React from 'react';

const Button = ({ type, onClick, label }) => {
    return (
        <div>
            <button onClick={onClick} className="button-ver button-success-ver">
                {label}
            </button>
        </div>
    )
}

export default Button;