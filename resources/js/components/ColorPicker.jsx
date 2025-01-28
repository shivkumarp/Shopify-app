import { Button } from '@shopify/polaris';
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ type, label, color, onColorChange }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);

    const togglePicker = () => setPickerVisible((prev) => !prev);

    return (
        <div className="mt-6 items-center">
            <span className="font-sm ml-10 py-2">{label}</span>
            <div className="flex items-center gap-1">
                {/* Color Preview Box */}
                <div
                    className="w-9 h-9 rounded-lg border shadow-sm"
                    style={{
                        backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`
                    }}
                />
                {/* Button with label and hex code */}
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

            {/* Color Picker */}
            {isPickerVisible && (
                <div className="mt-3">
                    <ChromePicker
                        color={color}
                        onChange={(newColor) => onColorChange(newColor, type)}
                    />
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
