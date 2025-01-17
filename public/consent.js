(function() {
    // Create a div for the consent banner
    const consentBanner = document.createElement('div');
    consentBanner.style.position = 'fixed';
    consentBanner.style.bottom = '0';
    consentBanner.style.left = '0';
    consentBanner.style.right = '0';
    consentBanner.style.backgroundColor = '#000';
    consentBanner.style.color = '#fff';
    consentBanner.style.padding = '15px';
    consentBanner.style.textAlign = 'center';
    consentBanner.style.zIndex = '10000';
    consentBanner.innerHTML = `
        <p>We use cookies to improve your experience. By continuing to use our site, you accept our cookie policy.
        <button id="acceptCookies" style="margin-left: 10px; padding: 5px 10px; background-color: #4caf50; color: white; border: none; border-radius: 5px;">Accept</button></p>
    `;

    document.body.appendChild(consentBanner);

    document.getElementById('acceptCookies').addEventListener('click', function() {
        document.cookie = "userConsent=true; path=/; max-age=" + 60 * 60 * 24 * 365; 
        consentBanner.remove();
    });

    // Check if the user has already given consent
    const cookies = document.cookie.split(';');
    const hasConsent = cookies.some(cookie => cookie.trim().startsWith('userConsent=true'));
    if (hasConsent) {
        consentBanner.remove();
    }
})();
