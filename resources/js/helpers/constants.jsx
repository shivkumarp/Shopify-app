
//Google Fonts Options
export const fontOptions = [
    { label: 'Roboto', value: '"Roboto", sans-serif' },
    { label: 'Open Sans', value: '"Open Sans", sans-serif' },
    { label: 'Inter', value: '"Inter", sans-serif' },
    { label: 'Poppins', value: '"Poppins", sans-serif' },
    { label: 'Montserrat', value: '"Montserrat", sans-serif' },
    { label: 'Nunito', value: '"Nunito", sans-serif' },
    { label: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
    { label: 'Ubuntu', value: '"Ubuntu", sans-serif' },

    // Serif Fonts
    { label: 'Lora', value: '"Lora", serif' },
    { label: 'Merriweather', value: '"Merriweather", serif' },
    { label: 'Playfair Display', value: '"Playfair Display", serif' },
    { label: 'PT Serif', value: '"PT Serif", serif' },

    // Display Fonts
    { label: 'Quicksand', value: '"Quicksand", sans-serif' },
    { label: 'Comfortaa', value: '"Comfortaa", cursive' },
    { label: 'Josefin Sans', value: '"Josefin Sans", sans-serif' },

    // Handwriting Style
    { label: 'Dancing Script', value: '"Dancing Script", cursive' },
    { label: 'Pacifico', value: '"Pacifico", cursive' }
];

//Font Sizes
export const fontSizeOptions = [
    { label: 'Tiny (12px)', value: '12px' },
    { label: 'Small (14px)', value: '14px' },
    { label: 'Medium (16px)', value: '16px' },
    { label: 'Large (18px)', value: '18px' },
    { label: 'Extra Large (20px)', value: '20px' },
    { label: 'Extra Extra Large (24px)', value: '24px' },
    { label: 'Huge (28px)', value: '28px' },
    { label: 'Massive (32px)', value: '32px' }
];

// Pop Positions
export const positionOptions = [
    { label: 'Top Left', value: 'top-left' },
    { label: 'Center', value: 'center' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Bottom Right', value: 'bottom-right' }
];

// Tabs For Settings Page
export const tabs = [
    { id: 'design-tab', content: 'Popup Design' },
    { id: 'settings-tab', content: 'Settings' },
];

//Setting Validation Types
export const validationTypes = [
    { label: 'Block Page', value: 'block' },
    { label: 'Redirect to Specific URL', value: 'redirect' },
];

//Popup View Type in User Store Page.
export const pageViewTypes = [
    { label: 'All Pages', value: 'all' },
    { label: 'Specific Products', value: 'specific' },
];

//Template Selection For Popup Design
export const templateDesignForPopUp = [
    {
        id: 0,
        backgroundColor: { red: 255, green: 255, blue: 255 },
        acceptButtonBgColor: { red: 255, green: 0, blue: 4 },
        acceptButtonTextColor: { red: 0, green: 0, blue: 0 },
        rejectButtonBgColor: { red: 17, green: 17, blue: 17 },
        rejectButtonTextColor: { red: 255, green: 255, blue: 255 },
        textColor: { red: 0, green: 0, blue: 0 },
    },
    {
        id: 1,
        backgroundColor: { red: 38, green: 84, blue: 124 },
        acceptButtonBgColor: { red: 239, green: 71, blue: 111 },
        acceptButtonTextColor: { red: 255, green: 255, blue: 255 },
        rejectButtonBgColor: { red: 255, green: 209, blue: 102 },
        rejectButtonTextColor: { red: 0, green: 0, blue: 0 },
        textColor: { red: 255, green: 255, blue: 255 },
    },
    {
        id: 2,
        backgroundColor: { red: 255, green: 255, blue: 255 },
        acceptButtonBgColor: { red: 1, green: 154, blue: 11 },
        acceptButtonTextColor: { red: 0, green: 0, blue: 0 },
        rejectButtonBgColor: { red: 34, green: 34, blue: 34 },
        rejectButtonTextColor: { red: 255, green: 255, blue: 255 },
        textColor: { red: 0, green: 0, blue: 0 },
    },
    {
        id: 3,
        backgroundColor: { red: 68, green: 55, blue: 48 },
        acceptButtonBgColor: { red: 163, green: 46, blue: 65 },
        acceptButtonTextColor: { red: 255, green: 255, blue: 255 },
        rejectButtonBgColor: { red: 120, green: 100, blue: 82 },
        rejectButtonTextColor: { red: 255, green: 255, blue: 255 },
        textColor: { red: 0, green: 0, blue: 0 },
    },
    {
        id: 4,
        backgroundColor: { red: 0, green: 0, blue: 0 },
        acceptButtonBgColor: { red:62 , green: 237, blue: 74 },
        acceptButtonTextColor: { red: 0, green: 0, blue: 0 },
        rejectButtonBgColor: { red: 255, green: 255, blue: 255 },
        rejectButtonTextColor: { red: 0, green: 0, blue: 0 },
        textColor: { red: 255, green: 255, blue: 255 },
    },
    {
        id: 5,
        backgroundColor: { red: 31, green: 176, blue: 166 },
        acceptButtonBgColor: { red: 17, green: 17, blue: 17 },
        acceptButtonTextColor: { red: 255, green: 255, blue: 255 },
        rejectButtonBgColor: { red: 255, green: 255, blue: 255 },
        rejectButtonTextColor: { red: 0, green: 0, blue: 0 },
        textColor: { red: 0, green: 0, blue: 0 },
    },
    {
        id: 6,
        backgroundColor: { red: 213, green: 160, blue: 33 },
        acceptButtonBgColor: { red: 75, green: 66, blue: 55 },
        acceptButtonTextColor: { red: 255, green: 255, blue: 255 },
        rejectButtonBgColor: { red: 237, green: 231, blue: 217 },
        rejectButtonTextColor: { red: 0, green: 0, blue: 0 },
        textColor: { red: 0, green: 0, blue: 0 },
    },
];

const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
};

export const themeViewColorSelector = [
 
    {
        from: rgbToHex(255, 0, 4),      // Red accept button
        to: rgbToHex(17, 17, 17)        // Black reject button
    },
    // Template 1: Pink to yellow
    {
        from: rgbToHex(239, 71, 111),   // Pink accept button
        to: rgbToHex(255, 209, 102)     // Yellow reject button
    },
    // Template 2: Green to black
    {
        from: rgbToHex(1, 154, 11),     // Green accept button
        to: rgbToHex(34, 34, 34)        // Black reject button
    },
    // Template 3: Dark red to brown
    {
        from: rgbToHex(163, 46, 65),    // Dark red accept button
        to: rgbToHex(120, 100, 82)      // Brown reject button
    },
    // Template 4: Green to white
    {
        from: rgbToHex(62, 237, 74),    // Green accept button
        to: rgbToHex(255, 255, 255)     // White reject button
    },
    // Template 5: Black to white
    {
        from: rgbToHex(17, 17, 17),     // Black accept button
        to: rgbToHex(255, 255, 255)     // White reject button
    },
    // Template 6: Dark brown to light beige
    {
        from: rgbToHex(75, 66, 55),     // Dark brown accept button
        to: rgbToHex(237, 231, 217)     // Light beige reject button
    }
];

