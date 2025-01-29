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
                    backgroundColor: `rgb(${designSettings?.backgroundColor?.red || 255}, ${designSettings?.backgroundColor?.green || 255}, ${designSettings?.backgroundColor?.blue || 255})`,
                    color: `rgb(${designSettings?.textColor?.red || 0}, ${designSettings?.textColor?.green || 0}, ${designSettings?.textColor?.blue || 0})`,
                    fontFamily: designSettings?.fontFamily || '"Open Sans", sans-serif',
                    fontSize: `${designSettings?.fontSize || 13}px`,
                    borderRadius: `${designSettings?.templateRound || 4}px`,
                    ...getPositionStyle?.('bottom-right'),
                    height: 'auto',
                    maxWidth: '720px',
                    maxHeight: '500px',
                    overflow: 'auto',
                }}
            >
                <h2
                    className="mb-4"
                    style={{
                        fontSize: `${designSettings?.titleFontSize || 18}px`,
                        fontWeight: 'bold',
                    }}
                >
                    {designSettings?.title || 'Your Title Here'}
                </h2>
                <p
                    className="mb-5"
                    style={{
                        fontSize: `${designSettings?.fontSize || 13}px`,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {designSettings?.description || 'Your description here'}
                </p>
                <div className="flex gap-2 justify-center">
                    <button
                        className="px-4 py-2"
                        style={{
                            backgroundColor: `rgb(${designSettings?.acceptButtonBgColor?.red || 255}, ${designSettings?.acceptButtonBgColor?.green || 0}, ${designSettings?.acceptButtonBgColor?.blue || 4})`,
                            color: `rgb(${designSettings?.acceptButtonTextColor?.red || 255}, ${designSettings?.acceptButtonTextColor?.green || 255}, ${designSettings?.acceptButtonTextColor?.blue || 255})`,
                            borderRadius: `${designSettings?.acceptButtonRound || 4}px`,
                            fontSize: `${designSettings?.fontSize || 13}px`,
                        }}
                    >
                        {designSettings?.acceptButtonText || 'Accept'}
                    </button>
                    <button
                        className="px-4 py-2"
                        style={{
                            backgroundColor: `rgb(${designSettings?.rejectButtonBgColor?.red || 17}, ${designSettings?.rejectButtonBgColor?.green || 17}, ${designSettings?.rejectButtonBgColor?.blue || 17})`,
                            color: `rgb(${designSettings?.rejectButtonTextColor?.red || 255}, ${designSettings?.rejectButtonTextColor?.green || 255}, ${designSettings?.rejectButtonTextColor?.blue || 255})`,
                            borderRadius: `${designSettings?.rejectButtonRound || 4}px`,
                            fontSize: `${designSettings?.fontSize || 13}px`,
                        }}
                    >
                        {designSettings?.rejectButtonText || 'No, thanks'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
