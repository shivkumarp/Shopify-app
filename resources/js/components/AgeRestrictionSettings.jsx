import { Button, Checkbox, FormLayout, Frame, Layout, Page, RangeSlider, Select, TextField, Toast, LegacyTabs, Modal, Text } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import useAxios from '../hooks/useAxios';
import PopupDesignTab from './PopupDesignTab';
import ProductSelectionList from './ProductSelectionList';
import { tabs, validationTypes, pageViewTypes } from '../helpers/constants';
import { Loader } from 'lucide-react';

const AgeRestrictionSettings = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { axios } = useAxios();
    const [products, setProducts] = useState({ selected: [], not_selected: [] });

    const [settings, setSettings] = useState({
        minimumAge: 40,
        validationType: 'block',
        redirectUrl: '',
        pageViewType: 'all',
        specificUrls: [],
        popupEnabled: true,
        rememberVerificationDays: 30
    });

    const [isModalActive, setIsModalActive] = useState(false);

    const toggleModal = useCallback(() => {
        setIsModalActive((active) => !active);
    }, []);

    //Get Products Api
    const getProducts = useCallback(async () => {
        await axios
            .get('/get-products')
            .then((response) => {
                const { selected = [], not_selected = [] } = response.data.data || {};
                setProducts({ selected, not_selected });
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setToastMessage('Failed to fetch products');
                setProducts({ selected: [], not_selected: [] });
            })
    }, [axios]);

    //Open Modal

    const openModal = useCallback(async () => {
        setLoading(true);
        try {
            await getProducts();
        } finally {
            setLoading(false);
        }
        toggleModal();
    }, [getProducts, toggleModal]);

    //Tab Change
    const handleTabChange = useCallback((selectedTabIndex) => {
        setSelectedTab(selectedTabIndex);
    }, []);

    const handleChange = useCallback((value, field) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    }, []);

    // Save Age Restriction Settings
    const saveSettings = useCallback(() => {
        setLoading(true);
    
        // Prepare API calls
        const saveSettingsApi = axios.post('/age-restriction/settings', settings);
        const uploadScriptApi = axios.post('/upload-script-tag-shopify');
    
        // Call both APIs concurrently
        Promise.all([saveSettingsApi, uploadScriptApi])
            .then(() => {
                console.log(saveSettingsApi,uploadScriptApi)
                setToastMessage('Settings saved successfully');
            })
            .catch((error) => {
                console.error('Error saving settings or uploading script:', error);
                setToastMessage('Failed to save settings');
            })
            .finally(() => setLoading(false));
    }, [axios, settings]);
    

    return (
        <Frame>
            <Page title="Age Restriction Settings">
                <LegacyTabs selected={selectedTab} onSelect={handleTabChange} tabs={tabs}>
                    {selectedTab === 0 && (
                        <div>
                            <PopupDesignTab />
                            <Button primary onClick={() => setSelectedTab(1)}>
                                Next: Configure Settings
                            </Button>
                        </div>
                    )}

                    {selectedTab === 1 && (
                        <Layout>
                            <Layout.Section>
                                <FormLayout>
                                    <Checkbox
                                        label="Enable Popup"
                                        checked={settings.popupEnabled}
                                        onChange={(value) => handleChange(value, 'popupEnabled')}
                                    />
                                    <RangeSlider
                                        output
                                        label={`Minimum Age: ${settings.minimumAge}`}
                                        min={13}
                                        max={21}
                                        step={1}
                                        value={settings.minimumAge}
                                        onChange={(value) => handleChange(value, 'minimumAge')}
                                    />
                                    <Select
                                        label="Validation Type"
                                        options={validationTypes}
                                        value={settings.validationType}
                                        onChange={(value) => handleChange(value, 'validationType')}
                                    />
                                    {settings.validationType === 'redirect' && (
                                        <TextField
                                            label="Redirect URL"
                                            value={settings.redirectUrl}
                                            onChange={(value) => handleChange(value, 'redirectUrl')}
                                            placeholder="https://example.com"
                                        />
                                    )}
                                    <Select
                                        label="Page View Type"
                                        options={pageViewTypes}
                                        value={settings.pageViewType}
                                        onChange={(value) => handleChange(value, 'pageViewType')}
                                    />
                                    {settings.pageViewType === 'specific' && (
                                        <>
                                            <Button onClick={openModal}>Select Products</Button>
                                            {settings.specificUrls.length > 0 && (
                                                <div style={{ marginTop: '1rem' }}>
                                                    <Text variant="bodyMd">
                                                        Selected Products: {settings.specificUrls.map(item => item.title).join(', ')}
                                                    </Text>
                                                </div>
                                            )}
                                            <Modal
                                                size="large"
                                                open={isModalActive}
                                                onClose={toggleModal}
                                                title="Select Specific Products"
                                            >
                                                <Modal.Section >
                                                    {loading ? (
                                                        <div className="flex items-center justify-center h-64">
                                                            <Loader className="w-8 h-8 animate-spin text-blue-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                            <ProductSelectionList
                                                                products={products}
                                                                setProducts={setProducts}
                                                                setToastMessage={setToastMessage}
                                                            />
                                                        </div>
                                                    )}
                                                </Modal.Section>
                                            </Modal>
                                        </>
                                    )}
                                    <RangeSlider
                                        output
                                        label={`Remember Verification (Days): ${settings.rememberVerificationDays}`}
                                        min={15}
                                        max={90}
                                        step={1}
                                        value={settings.rememberVerificationDays}
                                        onChange={(value) => handleChange(value, 'rememberVerificationDays')}
                                    />
                                    <Button
                                        primary
                                        onClick={saveSettings}
                                        loading={loading}
                                    >
                                        Save Settings
                                    </Button>
                                </FormLayout>
                            </Layout.Section>
                        </Layout>
                    )}
                </LegacyTabs>
                {toastMessage && (
                    <Toast content={toastMessage} onDismiss={() => setToastMessage('')} />
                )}
            </Page>
        </Frame>
    );
};

export default AgeRestrictionSettings;