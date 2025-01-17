import { Button, FormLayout, Layout, Select, TextField, Toast } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { fontOptions, fontSizeOptions, positionOptions } from '../helpers/constants';
import useAxios from '../hooks/useAxios';

const PopupDesignTab = () => {
    const [loading, setLoading] = useState(false)
    const { axios } = useAxios()
    const [toastMessage, setToastMessage] = useState('')

    const [colorPickers, setColorPickers] = useState({
        backgroundColor: false,
        textColor: false,
        acceptButtonBgColor: false,
        acceptButtonTextColor: false,
        rejectButtonBgColor: false,
        rejectButtonTextColor: false
    });

    const [selectedPosition, setSelectedPosition] = useState('top-right');
    const [designSettings, setDesignSettings] = useState({
        title: 'title',
        description: 'description',
        acceptButtonText: 'I am 18+ Years old.',
        rejectButtonText: 'I am not 18+ Years old.',
        backgroundColor: { red: 255, green: 255, blue: 255 },
        acceptButtonBgColor: { red: 255, green: 255, blue: 255 },
        acceptButtonTextColor: { red: 0, green: 0, blue: 0 },
        rejectButtonBgColor: { red: 255, green: 255, blue: 255 },
        rejectButtonTextColor: { red: 0, green: 0, blue: 0 },
        textColor: { red: 0, green: 0, blue: 0 },
        fontFamily: 'Arial',
        fontSize: '16px'
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(colorPickers).forEach((key) => {
                if (colorPickers[key] && !event.target.closest(`.color-picker-${key}`)) {
                    setColorPickers((prev) => ({ ...prev, [key]: false }));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [colorPickers]);

    const handleChange = useCallback((value, field) => {
        setDesignSettings((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleColorChange = (color, type) => {
        const rgbColor = {
            red: color.rgb.r,
            green: color.rgb.g,
            blue: color.rgb.b
        };
        setDesignSettings((prev) => ({ ...prev, [type]: rgbColor }));
    };

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

    const renderColorPicker = (type, label) => (
        <div className='mt-6'>
            <Button onClick={() => setColorPickers((prev) => ({ ...prev, [type]: !prev[type] }))}>
                {label}
            </Button>
            {colorPickers[type] && (
                <div className={`color-picker-${type}`}>
                    <ChromePicker
                        color={designSettings[type]}
                        onChange={(color) => handleColorChange(color, type)}
                    />
                </div>
            )}
        </div>
    );

    const savePopDesignData = () => {
        setLoading(true);
        const designData = {
            title: designSettings.title,
            description: designSettings.description,
            accept_button_text: designSettings.acceptButtonText,
            accept_button_text_color: JSON.stringify(designSettings.acceptButtonTextColor),
            accept_button_bg_color: JSON.stringify(designSettings.acceptButtonBgColor),
            reject_button_text: designSettings.rejectButtonText,
            reject_button_text_color: JSON.stringify(designSettings.rejectButtonTextColor),
            reject_button_bg_color: JSON.stringify(designSettings.rejectButtonBgColor),
            background_color: JSON.stringify(designSettings.backgroundColor),
            text_color: JSON.stringify(designSettings.textColor),
            font_family: designSettings.fontFamily,
            font_size: designSettings.fontSize,
            position: selectedPosition
        };

        console.log(designData);

        axios.post('/save-pop-design-data', designData)
            .then((response) => {
                console.log(response);
                setLoading(false);
                setToastMessage('Design settings saved successfully!');
            })
            .catch((error) => {
                setLoading(false);
                setToastMessage('Error saving design settings. Please try again.');
            });
    };

    return (
        <Layout>
            <Layout.Section>
                <FormLayout>
                    <TextField
                        label="Popup Title"
                        value={designSettings.title}
                        onChange={(value) => handleChange(value, 'title')}
                    />
                    <TextField
                        label="Description"
                        value={designSettings.description}
                        onChange={(value) => handleChange(value, 'description')}
                        multiline={3}
                    />
                    <div className="flex gap-4">
                        <TextField
                            label="Accept Button Text"
                            value={designSettings.acceptButtonText}
                            onChange={(value) => handleChange(value, 'acceptButtonText')}
                        />
                        {renderColorPicker('acceptButtonBgColor', 'Background Color')}
                        {renderColorPicker('acceptButtonTextColor', 'Text Color')}
                    </div>
                    <div className="flex gap-4">
                        <TextField
                            label="Reject Button Text"
                            value={designSettings.rejectButtonText}
                            onChange={(value) => handleChange(value, 'rejectButtonText')}
                        />
                        {renderColorPicker('rejectButtonBgColor', 'Background Color')}
                        {renderColorPicker('rejectButtonTextColor', 'Text Color')}
                    </div>
                    <Select
                        label="Font Family"
                        options={fontOptions}
                        value={designSettings.fontFamily}
                        onChange={(value) => handleChange(value, 'fontFamily')}
                    />
                    <Select
                        label="Font Size"
                        options={fontSizeOptions}
                        value={designSettings.fontSize}
                        onChange={(value) => handleChange(value, 'fontSize')}
                    />
                    <Select
                        label="Popup Position"
                        options={positionOptions}
                        value={selectedPosition}
                        onChange={(value) => setSelectedPosition(value)}
                    />
                    {renderColorPicker('backgroundColor', 'Choose Background Color')}
                    {renderColorPicker('textColor', 'Choose Text Color')}
                    <Button primary onClick={() => savePopDesignData()}>
                        Save Pop Design
                    </Button>
                </FormLayout>
                <div className="mt-5">
                    <div
                        className="p-5 text-center rounded-lg shadow-2xl fixed z-50"
                        style={{
                            backgroundColor: `rgb(${designSettings.backgroundColor.red}, ${designSettings.backgroundColor.green}, ${designSettings.backgroundColor.blue})`,
                            color: `rgb(${designSettings.textColor.red}, ${designSettings.textColor.green}, ${designSettings.textColor.blue})`,
                            fontFamily: designSettings.fontFamily,
                            fontSize: designSettings.fontSize,
                            ...getPositionStyle(selectedPosition),
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '50%', 
                            maxHeight: '50%', 
                            overflow: 'auto',
                        }}
                    >
                        <h2 className="mb-4">{designSettings.title || 'Your Title Here'}</h2>
                        <p className="mb-5">{designSettings.description || 'Your description here'}</p>
                        <div className="flex gap-2 justify-center">
                            <button
                                className="px-4 py-2 rounded"
                                style={{
                                    backgroundColor: `rgb(${designSettings.acceptButtonBgColor.red}, ${designSettings.acceptButtonBgColor.green}, ${designSettings.acceptButtonBgColor.blue})`,
                                    color: `rgb(${designSettings.acceptButtonTextColor.red}, ${designSettings.acceptButtonTextColor.green}, ${designSettings.acceptButtonTextColor.blue})`,
                                }}
                            >
                                {designSettings.acceptButtonText || 'Accept'}
                            </button>
                            <button
                                className="px-4 py-2 rounded"
                                style={{
                                    backgroundColor: `rgb(${designSettings.rejectButtonBgColor.red}, ${designSettings.rejectButtonBgColor.green}, ${designSettings.rejectButtonBgColor.blue})`,
                                    color: `rgb(${designSettings.rejectButtonTextColor.red}, ${designSettings.rejectButtonTextColor.green}, ${designSettings.rejectButtonTextColor.blue})`,
                                }}
                            >
                                {designSettings.rejectButtonText || 'No, thanks'}
                            </button>
                        </div>
                    </div>
                </div>

            </Layout.Section>
            {toastMessage && (
                <Toast content={toastMessage} onDismiss={() => setToastMessage('')} />
            )}
        </Layout>

    );
};

export default PopupDesignTab;
