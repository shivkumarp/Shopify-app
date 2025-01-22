import React, { useCallback, useState } from 'react';
import { Frame, Page, Layout, Button, Card, TextField } from '@shopify/polaris';
import useAxios from '../hooks/useAxios';

const ThemeViewPage = () => {
    const { axios } = useAxios();
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [headerFile, setHeaderFile] = useState('');
    const [selectedThemeId, setSelectedThemeId] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Fetch themes
    const getThemeId = useCallback(() => {
        setLoading(true);
        axios
            .get('/getThemeId')
            .then((response) => {
                setThemes(response.data.themes);
            })
            .catch((error) => {
                console.error('Error fetching theme data:', error);
            })
            .finally(() => setLoading(false));
    }, [axios]);


    const changeHeader = useCallback(() => {
        if (!selectedThemeId || !headerFile) {
            console.error('Theme ID or header file content is missing');
            return;
        }

        setUpdating(true);
        axios
            .put('/change-theme-header-file', {
                theme_id: selectedThemeId,
                header_file: headerFile,
            })
            .then((response) => {
                console.log('Header updated successfully:', response.data.message);
                alert('Header updated successfully');
            })
            .catch((error) => {
                console.error('Error updating header:', error);
                alert('Failed to update header');
            })
            .finally(() => setUpdating(false));
    }, [axios, selectedThemeId, headerFile]);

    const getMainTheme = useCallback(() => {
        setLoading(true);
        axios
            .get('/get-main-theme')
            .then((response) => {
                const { theme, assets } = response.data;
                setThemes([theme]);
                setSelectedThemeId(theme.id);
                setHeaderFile('');
                console.log('Assets:', assets);
            })
            .catch((error) => {
                console.error('Error fetching main theme pages:', error);
                alert('Failed to fetch main theme pages');
            })
            .finally(() => setLoading(false));
    }, [axios]);

    const getThemePages = useCallback(() => {
        setLoading(true);
        axios
            .put('/get-theme-pages')
            .then((response) => {
                const { theme, assets } = response.data;
                setThemes([theme]);
                setSelectedThemeId(theme.id);
                setHeaderFile('');
                console.log('Assets:', assets);
            })
            .catch((error) => {
                console.error('Error fetching main theme pages:', error);
                alert('Failed to fetch main theme pages');
            })
            .finally(() => setLoading(false));
    }, [axios]);


    return (
        <Frame>
            <Page title="Main Theme Pages">
                <Layout>
                    <Layout.Section>
                        {/* Fetch Main Theme */}
                        <Button primary loading={loading} onClick={getMainTheme}>
                            Fetch Main Theme
                        </Button>

                        {/* Show Main Theme Details */}
                        {themes.length > 0 && selectedThemeId && (
                            <Card sectioned title={`Main Theme: ${themes[0].name} (ID: ${themes[0].id})`}>
                                <p>Role: {themes[0].role}</p>
                                <p>Pages and Assets:</p>
                                <ul>
                                    {themes[0].assets?.map((asset) => (
                                        <li key={asset.key}>
                                            <strong>{asset.key}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        )}
                    </Layout.Section>

                    {/* Update Header Content */}
                    {selectedThemeId && (
                        <Layout.Section>
                            <Card sectioned title={`Update Header for Theme ID: ${selectedThemeId}`}>
                                <TextField
                                    label="Header Content"
                                    value={headerFile}
                                    onChange={(value) => setHeaderFile(value)}
                                    multiline
                                />
                                <Button primary onClick={changeHeader} loading={updating}>
                                    Update Header
                                </Button>
                            </Card>
                        </Layout.Section>
                    )}
                    
                    {/* Fetch Theme Pages */}
                    <Button primary loading={loading} onClick={getThemePages}>
                        Upload Js File
                    </Button>

                </Layout>
            </Page>
        </Frame>
    );

};

export default ThemeViewPage;
