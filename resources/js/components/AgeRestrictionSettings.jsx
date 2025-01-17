import { Button, Checkbox, FormLayout, Frame, Layout, Page, RangeSlider, Select, TextField, Toast, LegacyTabs, Modal, Text, Spinner } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import PopupDesignTab from './PopupDesignTab';

const AgeRestrictionSettings = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { axios } = useAxios();
    const [products, setProducts] = useState({ selected: [], not_selected: [] });
    const [selectedProducts, setSelectedProducts] = useState([]);

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

    //Get Products
    const getProducts = useCallback(() => {
        setLoading(true);
        axios
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
            .finally(() => setLoading(false));
    }, [axios]);

    const handleProductSelect = useCallback((id) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((productId) => productId !== id)
                : [...prevSelected, id]
        );
    }, []);

    const saveSelectedProducts = useCallback(() => {
        const allProducts = [
            ...(products.selected || []),
            ...(products.not_selected || [])
        ];

        const selectedItems = allProducts.filter(product =>
            selectedProducts.includes(product.product_id)
        );

        if (selectedItems.length === 0) {
            setToastMessage('No products selected');
            return;
        }

        axios
            .post('/save-products-app', { products: selectedItems })
            .then((response) => {
                console.log(response);
                setToastMessage('Products saved successfully');
                setSettings(prev => ({
                    ...prev,
                    specificUrls: selectedItems
                }));
                toggleModal();
            })
            .catch((error) => {
                console.error('Error saving products:', error);
                setToastMessage('Failed to save products');
            });
    }, [products, selectedProducts, toggleModal]);

    const handleDeleteSelectedProducts = useCallback(() => {
        const selectedItems = products.selected.filter((product) =>
            selectedProducts.includes(product.product_id)
        );
    
        if (selectedItems.length === 0) {
            setToastMessage('No products selected for deletion');
            return;
        }
    
        axios
            .post('/delete-products-app', { products: selectedItems })
            .then((response) => {
                console.log(response);
                setToastMessage('Selected products deleted successfully');
    
                // Update the state by removing deleted products
                setProducts((prev) => ({
                    selected: prev.selected.filter(
                        (product) => !selectedProducts.includes(product.product_id)
                    ),
                    not_selected: [...prev.not_selected, ...selectedItems],
                }));
                setSelectedProducts([]); 
            })
            .catch((error) => {
                console.error('Error deleting products:', error);
                setToastMessage('Failed to delete selected products');
            });
    }, [products, selectedProducts]);
    
    const openModal = useCallback(() => {
        getProducts();
        toggleModal();
    }, [getProducts, toggleModal]);

    const handleTabChange = useCallback((selectedTabIndex) => {
        setSelectedTab(selectedTabIndex);
    }, []);

    const handleChange = useCallback((value, field) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    }, []);

    const saveSettings = useCallback(() => {
        setLoading(true);
        axios
            .post('/age-restriction/settings', settings)
            .then(() => {
                setToastMessage('Settings saved successfully');
            })
            .catch((error) => {
                console.error('Error saving settings:', error);
                setToastMessage('Failed to save settings');
            })
            .finally(() => setLoading(false));
    }, [axios, settings]);

    const tabs = [
        { id: 'design-tab', content: 'Popup Design' },
        { id: 'settings-tab', content: 'Settings' },
    ];

    const ProductSelectionList = ({ products, selectedProducts, handleProductSelect }) => {
        const renderProductList = (productList, listType) => (
            productList.map((product) => (
                <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0"
                >
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.product_id)}
                            onChange={() => handleProductSelect(product.product_id)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {product.title} - {product.price === '0.00' ? '$0.00' : `$${product.price}`}
                        </span>
                    </label>
                    <span className="text-xs text-gray-500">ID: {product.product_id}</span>
                </div>
            ))
        );

        return (
            <div className="space-y-6">
                {/* Selected Products */}
                <div className="bg-white rounded-lg shadow">
                    <h3 className="px-4 py-2 text-lg font-semibold text-gray-800 border-b">
                        Selected Products
                    </h3>
                    <div className="max-h-72 overflow-y-auto">
                        {products.selected.length > 0 ? (
                            renderProductList(products.selected)
                        ) : (
                            <p className="p-4 text-sm text-gray-500">No selected products.</p>
                        )}
                    </div>
                </div>

                {/* Not Selected Products */}
                <div className="bg-white rounded-lg shadow">
                    <h3 className="px-4 py-2 text-lg font-semibold text-gray-800 border-b">
                        Not Selected Products
                    </h3>
                    <div className="max-h-72 overflow-y-auto">
                        {products.not_selected.length > 0 ? (
                            renderProductList(products.not_selected)
                        ) : (
                            <p className="p-4 text-sm text-gray-500">No unselected products.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

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
                                        options={[
                                            { label: 'Block Page', value: 'block' },
                                            { label: 'Show Restriction Message', value: 'message' },
                                            { label: 'Redirect to Specific URL', value: 'redirect' },
                                        ]}
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
                                        options={[
                                            { label: 'All Pages', value: 'all' },
                                            { label: 'Specific Products', value: 'specific' },
                                        ]}
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
                                                primaryAction={{
                                                    content: 'Save Selected Products',
                                                    onAction: saveSelectedProducts,
                                                }}
                                                secondaryActions={[
                                                    {
                                                        content: 'Delete Selected Products',
                                                        onAction: handleDeleteSelectedProducts,
                                                    },
                                                    {
                                                        content: 'Cancel',
                                                        onAction: toggleModal,
                                                    },
                                                ]}
                                            >
                                                <Modal.Section>
                                                    <div className="p-4 bg-gray-50 rounded-lg">
                                                        <ProductSelectionList
                                                            products={products}
                                                            selectedProducts={selectedProducts}
                                                            handleProductSelect={handleProductSelect}
                                                        />
                                                    </div>
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