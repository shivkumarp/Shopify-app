(async function () {
    // Get user_id from script URL
    const scriptTag = document.currentScript;
    const scriptUrl = new URL(scriptTag.src);
    const userId = scriptUrl.searchParams.get('user_id');
    console.log('User ID:', userId);

    async function loadAgeVerification(userId) {
        try {
            // Fetch settings from API
            const response = await fetch(`https://codeoink.com/api/settings/${userId}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const designSettings = data.design_settings;
            const ageSettings = data.age_restriction_settings;
            const specificUrls = data.specific_url || [];


            // Function to check if the current URL matches specific URLs
            function isSpecificUrl() {
                const currentUrl = window.location.href;
                return specificUrls.some((url) => currentUrl.includes(url.product_url));
            }

            // Function to check if age consent has already been given
            function checkAgeConsent() {
                return document.cookie.split(';').some((item) => item.trim().startsWith('remember_verification_days=true'));
            }

            // Exit if popup is disabled or consent already given
            if (!ageSettings?.popup_enabled || checkAgeConsent()) {
                console.log('Popup disabled or consent already given');
                return;
            }

            function createAgeVerificationModal(designSettings, ageSettings) {
                const modal = document.createElement('div');

                // Dynamic positioning logic
                let positionStyles = '';
                switch (designSettings.position) {
                    case 'top-left':
                        positionStyles = 'top: 10px; left: 10px;';
                        break;
                    case 'top-right':
                        positionStyles = 'top: 10px; right: 10px;';
                        break;
                    case 'center':
                        positionStyles = 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
                        break;
                    case 'bottom-left':
                        positionStyles = 'bottom: 10px; left: 10px;';
                        break;
                    case 'bottom-right':
                        positionStyles = 'bottom: 10px; right: 10px;';
                        break;
                    default:
                        positionStyles = 'top: 10px; left: 10px;';
                }

                // Modal parent container
                modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999999;
                display: block;
                `;

                const descriptionText = designSettings.description || 'Please verify your age to continue.';

                // Modal content (child) container
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    position: absolute;
                    ${positionStyles}
                    background-color: rgb(${designSettings.background_color.red}, ${designSettings.background_color.green}, ${designSettings.background_color.blue});
                    color: rgb(${designSettings.text_color.red}, ${designSettings.text_color.green}, ${designSettings.text_color.blue});
                    padding: 20px;
                    border-radius: ${designSettings.template_round || 8}px; /* Dynamic modal radius */
                    max-width: 720px;
                    width: 90%;
                    max-height:500px;
                    text-align: center;
                    font-family: ${designSettings.font_family};
                    font-size: ${designSettings.font_size}px;
                `;

                modalContent.innerHTML = `
                    <h2 style="
                        font-size: ${designSettings.title_font_size || 24}px; /* Dynamic title font size */
                        margin-bottom: 10px;
                    ">
                        ${designSettings.title || 'Age Verification'}
                    </h2>
                    <p style="
                    font-size: ${designSettings.font_size || 16}px; /* Dynamic description font size */
                     margin-bottom: 20px;
                     ">
                     ${descriptionText.replace(/\n/g, '<br/>')} 
                     </p>
                    <div>
                        <button id="confirmAge" style="
                            background-color: rgb(${designSettings.accept_button_bg_color.red}, ${designSettings.accept_button_bg_color.green}, ${designSettings.accept_button_bg_color.blue});
                            color: rgb(${designSettings.accept_button_text_color.red}, ${designSettings.accept_button_text_color.green}, ${designSettings.accept_button_text_color.blue});
                            padding: 10px 20px;
                            border: none;
                            border-radius: ${designSettings.accept_button_round || 8}px; /* Dynamic button radius */
                            cursor: pointer;
                            font-size: ${designSettings.font_size || 16}px; /* Dynamic button font size */
                            margin-right: 10px;
                        ">
                            ${designSettings.accept_button_text || 'Confirm'}
                        </button>
                        <button id="rejectAge" style="
                            background-color: rgb(${designSettings.reject_button_bg_color.red}, ${designSettings.reject_button_bg_color.green}, ${designSettings.reject_button_bg_color.blue});
                            color: rgb(${designSettings.reject_button_text_color.red}, ${designSettings.reject_button_text_color.green}, ${designSettings.reject_button_text_color.blue});
                            padding: 10px 20px;
                            border: none;
                            border-radius: ${designSettings.reject_button_round || 8}px; /* Dynamic button radius */
                            cursor: pointer;
                            font-size: ${designSettings.font_size || 16}px; /* Dynamic button font size */
                        ">
                            ${designSettings.reject_button_text || 'Reject'}
                        </button>
                    </div>
                `;


                document.body.appendChild(modal);
                modal.appendChild(modalContent);

                // Confirm age verification
                document.getElementById('confirmAge').addEventListener('click', () => {
                    const rememberDays = ageSettings.remember_verification_days || 30;
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + rememberDays);
                    document.cookie = `remember_verification_days=true; expires=${expiryDate.toUTCString()}; path=/`;
                    modal.remove();
                });

                // Reject age verification
                document.getElementById('rejectAge').addEventListener('click', () => {
                    if (ageSettings.validation_type === 'block') {
                        modalContent.innerHTML = `<p>${ageSettings.validation_message}</p>`;
                        const overlay = document.createElement('div');
                        overlay.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 999999;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        `;
                        document.body.appendChild(overlay);
                    } else if (ageSettings.validation_type === 'redirect') {
                        window.location.href = ageSettings.validation_redirect_url || '/';
                    }
                });
            }

            // Show modal based on settings
            if (ageSettings.page_view_type === 'all' || (ageSettings.page_view_type === 'specific' && isSpecificUrl())) {
                createAgeVerificationModal(designSettings, ageSettings);
            }

        } catch (error) {
            console.error('Error loading age restriction popup:', error);
        }
    }

    loadAgeVerification(userId);

})();