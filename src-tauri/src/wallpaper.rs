use std::ptr::null_mut;
use std::thread;
use std::time::Duration;
use windows::Win32::Foundation::{HWND, LPARAM, WPARAM};
use windows::Win32::UI::WindowsAndMessaging::*;

// Helper function to get current timestamp for logging
fn get_timestamp() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default();
    format!("{}.{:03}", duration.as_secs(), duration.subsec_millis())
}

#[derive(Debug)]
pub enum WallpaperError {
    WindowNotFound,
    ProgmanNotFound,
    WorkerWNotFound,
    SetParentFailed,
    MaxRetriesExceeded,
}

impl std::fmt::Display for WallpaperError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            WallpaperError::WindowNotFound => write!(f, "Wallpaper window not found"),
            WallpaperError::ProgmanNotFound => write!(f, "Program Manager window not found"),
            WallpaperError::WorkerWNotFound => write!(f, "WorkerW window not found after retries"),
            WallpaperError::SetParentFailed => write!(f, "Failed to set window parent to WorkerW"),
            WallpaperError::MaxRetriesExceeded => write!(f, "Maximum retry attempts exceeded"),
        }
    }
}

#[derive(Debug)]
pub struct WallpaperManager {
    wallpaper_hwnd: Option<isize>,
    workerw_hwnd: Option<isize>,
}

impl WallpaperManager {
    pub fn new() -> Self {
        Self {
            wallpaper_hwnd: None,
            workerw_hwnd: None,
        }
    }

    pub fn set_wallpaper_window_with_retry(&mut self, hwnd: isize, max_retries: u32) -> Result<(), String> {
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] Starting set_wallpaper_window_with_retry", get_timestamp());
        
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] Target wallpaper HWND: {}", get_timestamp(), hwnd);
        
        let mut last_error = String::new();
        
        for attempt in 0..max_retries {
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Retry attempt {} of {}", get_timestamp(), attempt + 1, max_retries);
            
            match self.set_wallpaper_window(hwnd) {
                Ok(_) => {
                    #[cfg(debug_assertions)]
                    println!("[WALLPAPER][{}] ✓ Successfully positioned wallpaper on attempt {}", get_timestamp(), attempt + 1);
                    
                    #[cfg(debug_assertions)]
                    println!("[WALLPAPER][{}] Operation completed successfully", get_timestamp());
                    
                    return Ok(());
                }
                Err(e) => {
                    last_error = e.clone();
                    #[cfg(debug_assertions)]
                    println!("[WALLPAPER][{}] ✗ Attempt {} failed with error: {}", get_timestamp(), attempt + 1, e);
                }
            }
            
            // Wait before retry (except on last attempt)
            if attempt < max_retries - 1 {
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] Waiting 200ms before next retry...", get_timestamp());
                thread::sleep(Duration::from_millis(200));
            }
        }
        
        let error_msg = format!("{}: {}", WallpaperError::MaxRetriesExceeded, last_error);
        
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] ✗ All retry attempts exhausted - operation failed", get_timestamp());
        
        #[cfg(not(debug_assertions))]
        eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error_msg);
        
        Err(error_msg)
    }



    pub fn set_wallpaper_window(&mut self, hwnd: isize) -> Result<(), String> {
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] === set_wallpaper_window called ===", get_timestamp());
        
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] Input wallpaper HWND: {}", get_timestamp(), hwnd);
        
        unsafe {
            // Step 1: Find Progman
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Step 1: Searching for Progman window...", get_timestamp());
            
            let progman = FindWindowW(
                windows::core::w!("Progman"),
                windows::core::w!("Program Manager"),
            ).map_err(|e| {
                let error_msg = format!("{}: {}", WallpaperError::ProgmanNotFound, e);
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] ✗ Failed to find Progman: {}", get_timestamp(), error_msg);
                
                #[cfg(not(debug_assertions))]
                eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error_msg);
                
                error_msg
            })?;

            if progman.0.is_null() {
                let error = WallpaperError::ProgmanNotFound.to_string();
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] ✗ Progman window handle is null", get_timestamp());
                
                #[cfg(not(debug_assertions))]
                eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error);
                
                return Err(error);
            }

            let progman_hwnd = progman.0 as isize;
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ Found Progman HWND: {}", get_timestamp(), progman_hwnd);

            // Step 2: Trigger WorkerW creation
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Step 2: Sending message to Progman to spawn WorkerW...", get_timestamp());
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Sending message 0x052C with 1000ms timeout", get_timestamp());
            
            SendMessageTimeoutW(
                progman,
                0x052C,
                WPARAM(0),
                LPARAM(0),
                SMTO_NORMAL,
                1000,
                None,
            );
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ Message sent to Progman", get_timestamp());

            // Step 3: Find WorkerW
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Step 3: Enumerating windows to find WorkerW...", get_timestamp());
            
            let mut workerw = HWND(null_mut());
            EnumWindows(
                Some(enum_windows_callback),
                LPARAM(&mut workerw as *mut _ as isize),
            ).ok();

            if workerw.0.is_null() {
                let error = WallpaperError::WorkerWNotFound.to_string();
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] ✗ WorkerW window not found after enumeration", get_timestamp());
                
                #[cfg(not(debug_assertions))]
                eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error);
                
                return Err(error);
            }

            let workerw_hwnd = workerw.0 as isize;
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ Found WorkerW HWND: {}", get_timestamp(), workerw_hwnd);

            // Step 4: Set parent relationship
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Step 4: Setting parent relationship...", get_timestamp());
            
            let wallpaper_hwnd = HWND(hwnd as *mut _);
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Calling SetParent(wallpaper={}, parent={})", get_timestamp(), hwnd, workerw_hwnd);
            
            let result = SetParent(wallpaper_hwnd, workerw);
            
            if let Err(e) = result {
                let error_msg = format!("{}: {}", WallpaperError::SetParentFailed, e);
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] ✗ SetParent failed: {}", get_timestamp(), error_msg);
                
                #[cfg(not(debug_assertions))]
                eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error_msg);
                
                return Err(error_msg);
            }
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ SetParent succeeded", get_timestamp());
            
            // Step 5: Show the window using Windows API
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Step 5: Showing wallpaper window using Windows API...", get_timestamp());
            
            let _ = ShowWindow(wallpaper_hwnd, SW_SHOW);
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ ShowWindow called", get_timestamp());
            
            // Step 6: Store the handles
            self.wallpaper_hwnd = Some(hwnd);
            self.workerw_hwnd = Some(workerw_hwnd);
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Stored handles in manager state:", get_timestamp());
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}]   - wallpaper_hwnd: {}", get_timestamp(), hwnd);
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}]   - workerw_hwnd: {}", get_timestamp(), workerw_hwnd);
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ set_wallpaper_window completed successfully", get_timestamp());
            
            Ok(())
        }
    }

    pub fn remove_wallpaper(&mut self) -> Result<(), String> {
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] === remove_wallpaper called ===", get_timestamp());
        
        if let Some(hwnd) = self.wallpaper_hwnd {
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Removing wallpaper with HWND: {}", get_timestamp(), hwnd);
            
            unsafe {
                let wallpaper_hwnd = HWND(hwnd as *mut _);
                
                // Step 1: Hide the window before removing parent
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] Step 1: Hiding wallpaper window...", get_timestamp());
                
                let hide_result = ShowWindow(wallpaper_hwnd, SW_HIDE);
                
                #[cfg(debug_assertions)]
                {
                    if hide_result.as_bool() {
                        println!("[WALLPAPER][{}] ✓ Window was visible and is now hidden", get_timestamp());
                    } else {
                        println!("[WALLPAPER][{}] ℹ Window was already hidden", get_timestamp());
                    }
                }
                
                // Step 2: Remove parent relationship (detach from WorkerW)
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] Step 2: Detaching window from WorkerW (setting parent to null)...", get_timestamp());
                
                let set_parent_result = SetParent(wallpaper_hwnd, HWND(null_mut()));
                
                match set_parent_result {
                    Ok(previous_parent) => {
                        let previous_parent_value = previous_parent.0 as isize;
                        
                        #[cfg(debug_assertions)]
                        println!("[WALLPAPER][{}] ✓ Successfully detached wallpaper from WorkerW", get_timestamp());
                        
                        #[cfg(debug_assertions)]
                        println!("[WALLPAPER][{}]   - Previous parent HWND: {}", get_timestamp(), previous_parent_value);
                        
                        // Step 3: Verify parent is properly set to null
                        #[cfg(debug_assertions)]
                        println!("[WALLPAPER][{}] Step 3: Verifying parent is set to null...", get_timestamp());
                        
                        let current_parent = GetParent(wallpaper_hwnd).ok();
                        
                        match current_parent {
                            Some(parent) if !parent.0.is_null() => {
                                let parent_value = parent.0 as isize;
                                let warning = format!("Parent verification failed: expected null but got HWND {}", parent_value);
                                
                                #[cfg(debug_assertions)]
                                println!("[WALLPAPER][{}] ⚠ {}", get_timestamp(), warning);
                                
                                #[cfg(not(debug_assertions))]
                                eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), warning);
                                
                                // Fallback: Force hide the window
                                #[cfg(debug_assertions)]
                                println!("[WALLPAPER][{}] Fallback: Force-hiding window...", get_timestamp());
                                
                                let _ = ShowWindow(wallpaper_hwnd, SW_HIDE);
                                
                                #[cfg(debug_assertions)]
                                println!("[WALLPAPER][{}] ✓ Window force-hidden as fallback", get_timestamp());
                            }
                            _ => {
                                #[cfg(debug_assertions)]
                                println!("[WALLPAPER][{}] ✓ Parent verification successful: parent is null", get_timestamp());
                            }
                        }
                    }
                    Err(e) => {
                        let error_msg = format!("Failed to detach wallpaper from WorkerW: {}", e);
                        
                        #[cfg(debug_assertions)]
                        println!("[WALLPAPER][{}] ✗ {}", get_timestamp(), error_msg);
                        
                        #[cfg(not(debug_assertions))]
                        eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error_msg);
                        
                        // Fallback: Force hide the window even if SetParent failed
                        #[cfg(debug_assertions)]
                        println!("[WALLPAPER][{}] Fallback: Force-hiding window despite SetParent failure...", get_timestamp());
                        
                        let _ = ShowWindow(wallpaper_hwnd, SW_HIDE);
                        
                        #[cfg(debug_assertions)]
                        println!("[WALLPAPER][{}] ✓ Window force-hidden as fallback", get_timestamp());
                        
                        // Clear handles and return error
                        self.wallpaper_hwnd = None;
                        self.workerw_hwnd = None;
                        
                        #[cfg(debug_assertions)]
                        println!("[WALLPAPER][{}] Cleared stored window handles", get_timestamp());
                        
                        return Err(error_msg);
                    }
                }
                
                // Step 4: Force refresh the desktop by hiding and showing WorkerW
                if let Some(workerw_hwnd_value) = self.workerw_hwnd {
                    #[cfg(debug_assertions)]
                    println!("[WALLPAPER][{}] Step 4: Refreshing desktop by toggling WorkerW visibility...", get_timestamp());
                    
                    let workerw_hwnd = HWND(workerw_hwnd_value as *mut _);
                    
                    // Hide WorkerW
                    let _ = ShowWindow(workerw_hwnd, SW_HIDE);
                    
                    #[cfg(debug_assertions)]
                    println!("[WALLPAPER][{}] ✓ WorkerW hidden", get_timestamp());
                    
                    // Show WorkerW again to refresh
                    let _ = ShowWindow(workerw_hwnd, SW_SHOW);
                    
                    #[cfg(debug_assertions)]
                    println!("[WALLPAPER][{}] ✓ WorkerW shown again (desktop refreshed)", get_timestamp());
                }
            }
            
            // Step 5: Release Windows API resources by clearing stored handles
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Step 5: Releasing Windows API resources...", get_timestamp());
            
            self.wallpaper_hwnd = None;
            self.workerw_hwnd = None;
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ Cleared stored window handles (resources released)", get_timestamp());
            
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] ✓ remove_wallpaper completed successfully", get_timestamp());
        } else {
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] No wallpaper window to remove (wallpaper_hwnd is None)", get_timestamp());
        }
        
        Ok(())
    }
}

unsafe extern "system" fn enum_windows_callback(hwnd: HWND, lparam: LPARAM) -> windows::Win32::Foundation::BOOL {
    let workerw_ptr = lparam.0 as *mut HWND;
    
    if let Ok(shelldll_hwnd) = FindWindowExW(hwnd, HWND(null_mut()), windows::core::w!("SHELLDLL_DefView"), None) {
        if !shelldll_hwnd.0.is_null() {
            if let Ok(next_hwnd) = FindWindowExW(HWND(null_mut()), hwnd, windows::core::w!("WorkerW"), None) {
                if !next_hwnd.0.is_null() {
                    *workerw_ptr = next_hwnd;
                    return windows::Win32::Foundation::BOOL(0);
                }
            }
        }
    }
    
    windows::Win32::Foundation::BOOL(1)
}
