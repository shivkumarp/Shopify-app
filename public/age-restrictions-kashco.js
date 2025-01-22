(async function () {
    // Get user_id from script URL
    const scriptTag = document.currentScript;
    const scriptUrl = new URL(scriptTag.src);
    const userId = scriptUrl.searchParams.get('user_id');
    console.log('User ID:', userId);

    async function loadAgeVerification(userId) {
        try {
            const response = await fetch(`https://9c21-180-214-141-46.ngrok-free.app/api/settings/${userId}`, {
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
            const specificUrl = data.specific_url;

            // If popup is not enabled or user already gave consent, exit
            if (!ageSettings?.popup_enabled || checkAgeConsent()) {
                console.log('Popup disabled or consent already given');
                return;
            }
            else if (ageSettings.page_view_type === 'specific') {
                console.log('Popup Enabled Specific url');
                return;
            }

            // Function to create the age verification modal
            function createAgeVerificationModal(designSettings = {}, ageSettings = {}, specificUrl = {}) {
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999999;
                `;
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    background-color: rgb(${designSettings.background_color.red}, ${designSettings.background_color.green}, ${designSettings.background_color.blue});
                    color: rgb(${designSettings.text_color.red}, ${designSettings.text_color.green}, ${designSettings.text_color.blue});
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    font-family: ${designSettings.font_family};
                    font-size: ${designSettings.font_size};
                `;
                modalContent.innerHTML = `
                <h2>${designSettings.title || 'Age Verification'}</h2>
                <p>${designSettings.description || 'Please verify your age to continue.'}</p>
                <div>
                    <button id="confirmAge" style="
                        background-color: rgb(${designSettings.accept_button_bg_color.red}, ${designSettings.accept_button_bg_color.green}, ${designSettings.accept_button_bg_color.blue});
                        color: rgb(${designSettings.accept_button_text_color.red}, ${designSettings.accept_button_text_color.green}, ${designSettings.accept_button_text_color.blue});
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">
                        ${designSettings.accept_button_text || 'Confirm'}
                    </button>
                    <button id="rejectAge" style="
                        background-color: rgb(${designSettings.reject_button_bg_color.red}, ${designSettings.reject_button_bg_color.green}, ${designSettings.reject_button_bg_color.blue});
                        color: rgb(${designSettings.reject_button_text_color.red}, ${designSettings.reject_button_text_color.green}, ${designSettings.reject_button_text_color.blue});
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        ${designSettings.reject_button_text || 'Reject'}
                    </button>
                </div>
            `;

                modal.appendChild(modalContent);
                document.body.appendChild(modal);

                document.getElementById('confirmAge').addEventListener('click', () => {
                    let remember_verification_days = ageSettings.remember_verification_days || 30;
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + remember_verification_days);
                    document.cookie = `remember_verification_days=true; expires=${expiryDate.toUTCString()}; path=/`;
                    modal.remove();
                });


                document.getElementById('rejectAge').addEventListener('click', () => {
                    console.log('Age rejected');
                    modal.remove();
                });
            }

            createAgeVerificationModal(designSettings, ageSettings, specificUrl);

            function checkAgeConsent() {
                return document.cookie.split(';').some((item) => item.trim().startsWith('remember_verification_days=true'));
            }

        } catch (error) {
            console.error('Error loading age restriction popup:', error);
        }
    }

    loadAgeVerification(userId);

})();