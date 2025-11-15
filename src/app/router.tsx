import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppTabs from './tabs'
import WallpaperDisplay from './routes/wallpaper'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppTabs />} />
                <Route path="/wallpaper" element={<WallpaperDisplay />} />
            </Routes>
        </BrowserRouter>
    )
}
