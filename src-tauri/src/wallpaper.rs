use std::ptr::null_mut;
use windows::Win32::Foundation::{HWND, LPARAM, WPARAM};
use windows::Win32::Graphics::Gdi::HBRUSH;
use windows::Win32::UI::WindowsAndMessaging::*;

#[derive(Debug)]
pub struct WallpaperManager {
    wallpaper_hwnd: Option<isize>,
}

impl WallpaperManager {
    pub fn new() -> Self {
        Self {
            wallpaper_hwnd: None,
        }
    }

    pub fn set_wallpaper_window(&mut self, hwnd: isize) -> Result<(), String> {
        unsafe {
            let progman = FindWindowW(
                windows::core::w!("Progman"),
                windows::core::w!("Program Manager"),
            );

            if progman.0 == 0 {
                return Err("Failed to find Program Manager".to_string());
            }

            // Trigger WorkerW creation
            SendMessageTimeoutW(
                progman,
                0x052C,
                WPARAM(0),
                LPARAM(0),
                SMTO_NORMAL,
                1000,
                None,
            );

            let mut workerw = HWND(0);
            EnumWindows(
                Some(enum_windows_callback),
                LPARAM(&mut workerw as *mut _ as isize),
            );

            if workerw.0 == 0 {
                return Err("Failed to find WorkerW".to_string());
            }

            let wallpaper_hwnd = HWND(hwnd);
            SetParent(wallpaper_hwnd, workerw);
            
            self.wallpaper_hwnd = Some(hwnd);
            Ok(())
        }
    }

    pub fn remove_wallpaper(&mut self) -> Result<(), String> {
        if let Some(hwnd) = self.wallpaper_hwnd {
            unsafe {
                SetParent(HWND(hwnd), HWND(0));
            }
            self.wallpaper_hwnd = None;
        }
        Ok(())
    }
}

unsafe extern "system" fn enum_windows_callback(hwnd: HWND, lparam: LPARAM) -> windows::Win32::Foundation::BOOL {
    let workerw_ptr = lparam.0 as *mut HWND;
    
    let shelldll_hwnd = FindWindowExW(hwnd, HWND(0), windows::core::w!("SHELLDLL_DefView"), None);
    
    if shelldll_hwnd.0 != 0 {
        let next_hwnd = FindWindowExW(HWND(0), hwnd, windows::core::w!("WorkerW"), None);
        if next_hwnd.0 != 0 {
            *workerw_ptr = next_hwnd;
            return windows::Win32::Foundation::BOOL(0);
        }
    }
    
    windows::Win32::Foundation::BOOL(1)
}
