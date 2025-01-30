import React from 'react';

const Popup = ({ designSettings, selectedPosition }) => {

    const getPositionStyle = (position) => {
        const positions = {
            center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            'top-right': { top: '10px', right: '10px' },
            'bottom-left': { bottom: '10px', left: '10px' },
            'bottom-right': { bottom: '10px', right: '10px' },
            'top-left': { top: '10px', left: '10px' }
        };
        return positions[position] || positions['top-left'];
    }


    return (
        <div className="mt-5">
            <div
                className="p-5 text-center shadow-2xl fixed z-50"
                style={{
                    backgroundColor: `rgb(${designSettings.backgroundColor.red}, ${designSettings.backgroundColor.green}, ${designSettings.backgroundColor.blue})`,
                    color: `rgb(${designSettings.textColor.red}, ${designSettings.textColor.green}, ${designSettings.textColor.blue})`,
                    fontFamily: designSettings.fontFamily,
                    fontSize: `${designSettings.fontSize}px`,
                    borderRadius: `${designSettings.templateRound}px`,
                    height: 'auto',
                    maxWidth: '720px',
                    maxHeight: '500px',
                    overflow: 'auto',
                    ...(window.innerWidth <= 768 ? { 
                        left: '50%', 
                        top: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        // bottom: 'auto', 
                        // right: 'auto',
                           width:'90%'
                    } : getPositionStyle?.('bottom-right')), 
                }}
            >
                <h2
                    className="mb-4"
                    style={{
                        fontSize: `${designSettings.titleFontSize}px`,
                        fontWeight: 'bold',
                    }}
                >
                    {designSettings.title}
                </h2>
                <p
                    className="mb-5"
                    style={{
                        fontSize: `${designSettings.fontSize}px`,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {designSettings.description}
                </p>
                <div className="flex gap-2 justify-center">
                    <button
                        className="px-4 py-2"
                        style={{
                            backgroundColor: `rgb(${designSettings.acceptButtonBgColor.red}, ${designSettings.acceptButtonBgColor.green}, ${designSettings.acceptButtonBgColor.blue})`,
                            color: `rgb(${designSettings.acceptButtonTextColor.red}, ${designSettings.acceptButtonTextColor.green}, ${designSettings.acceptButtonTextColor.blue})`,
                            borderRadius: `${designSettings.rejectButtonRound}px`,
                            fontSize: `${designSettings.fontSize}px`,
                        }}
                    >
                        {designSettings.acceptButtonText}
                    </button>
                    <button
                        className="px-4 py-2"
                        style={{
                            backgroundColor: `rgb(${designSettings.rejectButtonBgColor.red}, ${designSettings.rejectButtonBgColor.green}, ${designSettings.rejectButtonBgColor.blue})`,
                            color: `rgb(${designSettings.rejectButtonTextColor.red}, ${designSettings.rejectButtonTextColor.green}, ${designSettings.rejectButtonTextColor.blue})`,
                            borderRadius: `${designSettings.rejectButtonRound}px`,
                            fontSize: `${designSettings.fontSize}px`,
                        }}
                    >
                        {designSettings.rejectButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
