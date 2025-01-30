import { Button } from '@shopify/polaris';
import React, { useState, useRef } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ type, label, color = { red: 0, green: 0, blue: 0 }, onColorChange }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const buttonRef = useRef(null);

    const togglePicker = () => setPickerVisible((prev) => !prev);

    // Convert our RGB object to the format ChromePicker expects
    const rgbColor = {
        r: color.red,
        g: color.green,
        b: color.blue
    };

    // Handle color change from ChromePicker
    const handleColorChange = (newColor) => {
        const { r, g, b } = newColor.rgb;
        const rgbColor = {
            red: r,
            green: g,
            blue: b
        };
        onColorChange(rgbColor, type);
    };

    return (
        <div className="mt-6 items-center">
            <span className="font-sm ml-10 py-2">{label}</span>
            <div className="flex items-center gap-1 relative">
                {/* Color Preview Box */}
                <div
                    className="w-9 h-9 rounded-lg border shadow-sm"
                    style={{
                        backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`
                    }}
                />
                {/* Button with label and hex code */}
                <div ref={buttonRef}>
                    <Button
                        onClick={togglePicker}
                        className="text-black bg-white hover:bg-gray-100 border"
                    >
                        <span className="font-mono text-sm">
                            #{((1 << 24) + (color.red << 16) + (color.green << 8) + color.blue)
                                .toString(16)
                                .slice(1)
                                .toUpperCase()}
                        </span>
                    </Button>
                </div>
                
                {/* Color Picker Popover */}
                {isPickerVisible && (
                    <>
                        <div className="fixed inset-0 z-50" onClick={togglePicker} />
                        <div 
                            className="absolute z-50"
                            style={{
                                top: '100%',
                                left: '0',
                                marginTop: '8px'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <ChromePicker
                                color={rgbColor}
                                onChange={handleColorChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ColorPicker;
