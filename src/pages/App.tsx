import { FC, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { TapPage } from '../components/TapPage';
import { FriendsPage } from '../components/FriendsPage'
import { getActiveNavTab } from '../store/app/selectors';
import { useSelector } from 'react-redux';
import { Tasks } from '../components/Tasks';
import { Inventory } from '../components/Inventory';
import { Roadmap } from '../components/Roadmap';

import WebApp from '@twa-dev/sdk'

export const App: FC = () => {
    const activeTab = useSelector(getActiveNavTab);

    useEffect(() => {
        WebApp.expand()
    }, [])

    const renderContent = () => {
        switch (activeTab) {
            case 'inventory':
                return <Inventory />
            case 'tasks':
                return <Tasks />
            case 'main':
                return <TapPage />
            case 'friends':
                return <FriendsPage />;
            case 'roadmap':
                return <Roadmap />
            default:
                return <div>Default Content</div>;
        }
    };
    return (
        <>
            <Layout>
                {renderContent()}
            </Layout>
        </>
    );
};