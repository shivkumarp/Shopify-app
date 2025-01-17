import { Provider } from "@shopify/app-bridge-react";
import { AppProvider, Page } from "@shopify/polaris";
import { useState } from "react";
import enTranslations from "@shopify/polaris/locales/en.json";
import MissingApiKey from "./components/MissingApiKey";
import AgeRestrictionSettings from "./components/AgeRestrictionSettings";

const App = () => {
    const [appBridgeConfig] = useState(() => {
        const host = new URLSearchParams(location.search).get("host") || window.__SHOPIFY_HOST;
        window.__SHOPIFY_HOST = host;
        return {
            host,
            apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
            forceRedirect: true,
        };
    });

    if (!appBridgeConfig.apiKey) {
        return (
            <AppProvider i18n={enTranslations}>
                <MissingApiKey />
            </AppProvider>
        );
    }
    return (
        <AppProvider i18n={enTranslations}>
            <Provider config={appBridgeConfig}>
                <Page>
                    <AgeRestrictionSettings />
                </Page>
            </Provider>
        </AppProvider>
    );
};

export default App;
