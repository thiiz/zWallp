import './global.css'

import AppProvider from '@/app/provider'
import AppTabs from '@/app/tabs'

function App() {
    return (
        <AppProvider>
            <AppTabs />
        </AppProvider>
    )
}

export default App
