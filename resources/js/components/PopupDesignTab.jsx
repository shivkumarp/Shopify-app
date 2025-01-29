import { Button, FormLayout, Layout, RangeSlider, Select, TextField, Toast } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { fontOptions, themeViewColorSelector, positionOptions, templateDesignForPopUp } from '../helpers/constants';
import useAxios from '../hooks/useAxios';
import Popup from './Popup';
import ColorPicker from './ColorPicker';

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

    const [selectedPosition, setSelectedPosition] = useState('bottom-right');
    const [designSettings, setDesignSettings] = useState({
        title: 'Age Verification',
        titleFontSize: 18,
        description: 'You must be 18 years or older to access this website.',
        acceptButtonText: 'Yes, I\'m over 18',
        acceptButtonRound: 4,
        rejectButtonText: 'No, I\'m under 18',
        rejectButtonRound: 4,
        backgroundColor: { red: 255, green: 255, blue: 255 },
        acceptButtonBgColor: { red: 255, green: 0, blue: 4 },
        acceptButtonTextColor: { red: 255, green: 255, blue: 255 },
        rejectButtonBgColor: { red: 17, green: 17, blue: 17 },
        rejectButtonTextColor: { red: 255, green: 255, blue: 255 },
        textColor: { red: 0, green: 0, blue: 0 },
        fontFamily: '"Open Sans", sans-serif',
        fontSize: 13,
        templateRound: 4
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

    const handleChange = (value, field) => {
        const numericFields = ['acceptButtonRound', 'rejectButtonRound'];

        setDesignSettings(prev => ({
            ...prev,
            [field]: numericFields.includes(field) ? Number(value) : value
        }));
    };

    const handleColorChange = (color, type) => {
        const rgbColor = {
            red: color.rgb.r,
            green: color.rgb.g,
            blue: color.rgb.b
        };
        setDesignSettings((prev) => ({ ...prev, [type]: rgbColor }));
    };

    const savePopDesignData = () => {
        setLoading(true);
        const designData = {
            title: designSettings.title,
            title_font_size: designSettings.titleFontSize,
            description: designSettings.description,
            accept_button_text: designSettings.acceptButtonText,
            accept_button_round: designSettings.rejectButtonRound,
            accept_button_text_color: JSON.stringify(designSettings.acceptButtonTextColor),
            accept_button_bg_color: JSON.stringify(designSettings.acceptButtonBgColor),
            reject_button_text: designSettings.rejectButtonText,
            reject_button_round: designSettings.rejectButtonRound,
            reject_button_text_color: JSON.stringify(designSettings.rejectButtonTextColor),
            reject_button_bg_color: JSON.stringify(designSettings.rejectButtonBgColor),
            background_color: JSON.stringify(designSettings.backgroundColor),
            text_color: JSON.stringify(designSettings.textColor),
            font_family: designSettings.fontFamily,
            font_size: designSettings.fontSize,
            position: selectedPosition,
            template_round: designSettings.templateRound
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
                setToastMessage('Error saving design settings. Please try again.', error);
            });
    };

    useEffect(() => {
        axios.get('/get-pop-design-data')
            .then(response => {
                if (response.data.success && response.data.data) {
                    setDesignSettings({
                        title: response.data.data.title || 'Age Verification',
                        titleFontSize: response.data.data.title_font_size || 18,
                        description: response.data.data.description || 'You must be 18 years or older to access this website.',
                        acceptButtonText: response.data.data.accept_button_text || 'Yes, I\'m over 18',
                        acceptButtonRound: response.data.data.accept_button_round || 4,
                        rejectButtonText: response.data.data.reject_button_text || 'No, I\'m under 18',
                        rejectButtonRound: response.data.data.reject_button_round || 4,
                        backgroundColor: response.data.data.background_color || { red: 255, green: 255, blue: 255 },
                        acceptButtonBgColor: response.data.data.accept_button_bg_color || { red: 255, green: 0, blue: 4 },
                        acceptButtonTextColor: response.data.data.accept_button_text_color || { red: 255, green: 255, blue: 255 },
                        rejectButtonBgColor: response.data.data.reject_button_bg_color || { red: 17, green: 17, blue: 17 },
                        rejectButtonTextColor: response.data.data.reject_button_text_color || { red: 255, green: 255, blue: 255 },
                        textColor: response.data.data.text_color || { red: 0, green: 0, blue: 0 },
                        fontFamily: response.data.data.font_family || '"Open Sans", sans-serif',
                        fontSize: response.data.data.font_size || 13,
                        templateRound: response.data.data.template_round || 4
                    });
                    setSelectedPosition(response.data.data.position || 'bottom-right');
                } else {
                    saveDefaultSettings();
                }
            })
            .catch(error => {
                console.error('Error fetching design settings:', error);
                saveDefaultSettings();
            });

        function saveDefaultSettings() {
            const defaultData = {
                title: 'Age Verification',
                title_font_size: 18,
                description: 'You must be 18 years or older to access this website.',
                accept_button_text: 'Yes, I\'m over 18',
                accept_button_round: 4,
                reject_button_text: 'No, I\'m under 18',
                reject_button_round: 4,
                background_color: JSON.stringify({ red: 255, green: 255, blue: 255 }),
                accept_button_bg_color: JSON.stringify({ red: 255, green: 0, blue: 4 }),
                accept_button_text_color: JSON.stringify({ red: 255, green: 255, blue: 255 }),
                reject_button_bg_color: JSON.stringify({ red: 17, green: 17, blue: 17 }),
                reject_button_text_color: JSON.stringify({ red: 255, green: 255, blue: 255 }),
                text_color: JSON.stringify({ red: 0, green: 0, blue: 0 }),
                font_family: '"Open Sans", sans-serif',
                font_size: 13,
                template_round: 4
            };

            axios.post('/save-pop-design-data', defaultData)
                .then(() => {
                    console.log('Default settings saved successfully');
                    setDesignSettings(defaultData);
                })
                .catch((error) => {
                    console.error('Error saving default settings:', error);
                });
        }
    }, []);


    const handleTemplateChange = (templateId) => {
        console.log(templateId);
        const selectedTemplate = templateDesignForPopUp.find((template) => template.id === templateId);
        if (selectedTemplate) {
            setDesignSettings((prevSettings) => ({
                ...prevSettings,
                ...selectedTemplate,
            }));
        }
    }

    return (
        <Layout>
            <Layout.Section>
                {/* Container */}
                <div className="max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
                    <FormLayout>
                        {/* Templates Section */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-1">Ready For You Templates</h3>
                            <div className="flex gap-2 mb-2 ">
                                {themeViewColorSelector.map((gradient, index) => (
                                    <div
                                        key={index}
                                        className={`w-10 h-5 rounded-sm cursor-pointer`}
                                        style={{
                                            background: `linear-gradient(to right, ${gradient.from} 0,${gradient.from} 33.333%, ${gradient.middle} 33.333%,${gradient.middle} 66.666%, ${gradient.to} 66.666%,${gradient.to} 100%)`
                                        }}
                                        onClick={() => handleTemplateChange(index)}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Title Section */}
                        <div className="grid grid-cols-2 gap-8">
                            <TextField
                                label="Title"
                                value={designSettings.title}
                                onChange={(value) => handleChange(value, 'title')}
                            />
                            <div className="px-6">
                                <label className="block mb-4">{`Title Font Size: ${designSettings.titleFontSize ?? 10}px`}</label>
                                <RangeSlider
                                    output
                                    min={10}
                                    max={100}
                                    step={1}
                                    value={designSettings.titleFontSize ?? 10}
                                    onChange={(value) => handleChange(value, 'titleFontSize')}
                                />
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="mb-6">
                            <TextField
                                label="Description"
                                value={designSettings.description}
                                onChange={(value) => handleChange(value, 'description')}
                                multiline={2}
                            />
                        </div>

                        {/* Font and Position Settings */}
                        <div className="grid p-2 grid-cols-3 gap-4 mb-4">
                            <Select
                                label="Font Family"
                                options={fontOptions}
                                value={designSettings.fontFamily}
                                onChange={(value) => handleChange(value, 'fontFamily')}
                            />

                            <div className="px-6">
                                <label className="block mb-4">{`Font Size: ${designSettings.fontSize ?? 10}px`}</label>
                                <RangeSlider
                                    output
                                    min={10}
                                    max={100}
                                    step={1}
                                    value={designSettings.fontSize ?? 10}
                                    onChange={(value) => handleChange(value, 'fontSize')}
                                />
                            </div>
                            <div className="px-6">
                                <label className="block mb-4">{`Popup Corner Radius: ${designSettings.templateRound ?? 1}px`}</label>
                                <RangeSlider
                                    output
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={designSettings.templateRound ?? 1}
                                    onChange={(value) => handleChange(value, 'templateRound')}
                                />
                            </div>

                        </div>

                        {/* Color Settings */}
                        <div className=" p-4 mb-2">
                            <div className="flex items-center gap-1">
                                <div className="flex-1 mb-4">
                                    <ColorPicker
                                        type="backgroundColor"
                                        label="Background Color"
                                        color={designSettings.backgroundColor}
                                        onColorChange={handleColorChange}
                                    />
                                </div>
                                <div className="flex-1 mb-4">
                                    <ColorPicker
                                        type="textColor"
                                        label="Text Color"
                                        color={designSettings.textColor}
                                        onColorChange={handleColorChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Popup Position"
                                        options={positionOptions}
                                        value={selectedPosition}
                                        onChange={(value) => setSelectedPosition(value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Accept Button Section */}
                        <div className="p-4 rounded-lg mb-1">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Accept Button Section - Left */}
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h3 className="text-sm font-bold mb-1">Accept Button Settings</h3>
                                    <div className=" grid grid-cols-1 gap-4">
                                        <TextField
                                            label="Button Text"
                                            value={designSettings.acceptButtonText}
                                            onChange={(value) => handleChange(value, 'acceptButtonText')}
                                        />
                                        <ColorPicker
                                            type="acceptButtonBgColor"
                                            label="Button Color"
                                            color={designSettings.acceptButtonBgColor}
                                            onColorChange={handleColorChange}
                                        />
                                        <ColorPicker
                                            type="acceptButtonTextColor"
                                            label="Text Color"
                                            color={designSettings.acceptButtonTextColor}
                                            onColorChange={handleColorChange}
                                        />
                                    </div>
                                </div>

                                {/* Reject Button Section - Right */}
                                <div className="p-4 bg-gray-100 rounded-lg">
                                    <h3 className="text-sm font-bold mb-1">Reject Button Settings</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <TextField
                                            label="Button Text"
                                            value={designSettings.rejectButtonText}
                                            onChange={(value) => handleChange(value, 'rejectButtonText')}
                                        />
                                        <ColorPicker
                                            type="rejectButtonBgColor"
                                            label="Button Color"
                                            color={designSettings.rejectButtonBgColor}
                                            onColorChange={handleColorChange}
                                        />
                                        <ColorPicker
                                            type="rejectButtonTextColor"
                                            label="Text Color"
                                            color={designSettings.rejectButtonTextColor}
                                            onColorChange={handleColorChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Round Section - Centered Below */}
                            <div className="px-6">
                                <label className="block mb-4">{`Button Radius: ${designSettings.rejectButtonRound ?? 0}px`}</label>
                                <RangeSlider
                                    output
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={designSettings.rejectButtonRound ?? 0}
                                    onChange={(value) => handleChange(value, 'rejectButtonRound')}
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-start">
                            <Button
                                primary
                                onClick={savePopDesignData}
                                className="px-6 py-2"
                            >
                                Save Pop Design
                            </Button>
                        </div>
                    </FormLayout>
                    {/* Popup Preview */}
                    <Popup designSettings={designSettings} selectedPosition={selectedPosition} />
                </div>
            </Layout.Section>

            {/* Toast Notification */}
            {toastMessage && (
                <Toast content={toastMessage} onDismiss={() => setToastMessage('')} />
            )}
        </Layout>
    );

};

export default PopupDesignTab;
