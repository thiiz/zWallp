#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod wallpaper;

use std::sync::Mutex;
use tauri::State;
use wallpaper::WallpaperManager;

struct AppState {
    wallpaper_manager: Mutex<WallpaperManager>,
}

#[tauri::command]
fn apply_wallpaper(app: tauri::AppHandle, state: State<AppState>) -> Result<(), String> {
    use tauri::Manager;

    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] === APPLY WALLPAPER CALLED ===",
        get_timestamp()
    );

    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] Looking for existing wallpaper window",
        get_timestamp()
    );

    let wallpaper_window = app.get_webview_window("wallpaper").ok_or_else(|| {
        let error = "Wallpaper window not found";
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] ✗ {}", get_timestamp(), error);

        #[cfg(not(debug_assertions))]
        eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error);

        error.to_string()
    })?;

    #[cfg(debug_assertions)]
    println!("[WALLPAPER][{}] ✓ Found wallpaper window", get_timestamp());

    #[cfg(debug_assertions)]
    println!("[WALLPAPER][{}] Getting window HWND", get_timestamp());

    let hwnd = wallpaper_window.hwnd().map_err(|e| {
        let error_msg = e.to_string();
        #[cfg(debug_assertions)]
        println!(
            "[WALLPAPER][{}] ✗ Failed to get HWND: {}",
            get_timestamp(),
            error_msg
        );

        error_msg
    })?;

    let hwnd_value = hwnd.0 as isize;

    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] ✓ Got HWND: {}",
        get_timestamp(),
        hwnd_value
    );

    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] Applying wallpaper positioning",
        get_timestamp()
    );

    let mut manager = state.wallpaper_manager.lock().unwrap();
    let result = manager.set_wallpaper_window(hwnd_value);

    match &result {
        Ok(_) => {
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✓ Wallpaper positioned successfully",
                get_timestamp()
            );

            // Drop the lock before showing the window
            drop(manager);

            // Show the window now that it's properly positioned
            #[cfg(debug_assertions)]
            println!("[WALLPAPER][{}] Showing wallpaper window", get_timestamp());

            wallpaper_window.show().map_err(|e| {
                let error_msg = format!("Failed to show window: {}", e);
                #[cfg(debug_assertions)]
                println!("[WALLPAPER][{}] ✗ {}", get_timestamp(), error_msg);
                error_msg
            })?;

            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✓ apply_wallpaper completed successfully",
                get_timestamp()
            );
        }
        Err(e) => {
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✗ apply_wallpaper failed: {}",
                get_timestamp(),
                e
            );

            #[cfg(not(debug_assertions))]
            eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), e);
        }
    }

    result
}

#[tauri::command]
fn remove_wallpaper(state: State<AppState>) -> Result<(), String> {
    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] === REMOVE WALLPAPER CALLED ===",
        get_timestamp()
    );

    let mut manager = state.wallpaper_manager.lock().unwrap();
    let result = manager.remove_wallpaper();

    match &result {
        Ok(_) => {
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✓ remove_wallpaper completed successfully",
                get_timestamp()
            );
        }
        Err(e) => {
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✗ remove_wallpaper failed: {}",
                get_timestamp(),
                e
            );

            #[cfg(not(debug_assertions))]
            eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), e);
        }
    }

    result
}

#[tauri::command]
async fn create_wallpaper_window(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] === CREATE WALLPAPER WINDOW CALLED ===",
        get_timestamp()
    );

    // Check if window already exists
    if let Some(existing) = app.get_webview_window("wallpaper") {
        #[cfg(debug_assertions)]
        println!(
            "[WINDOW][{}] Wallpaper window already exists with label: {}",
            get_timestamp(),
            existing.label()
        );

        return Ok(());
    }

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] No existing wallpaper window found, creating new window",
        get_timestamp()
    );

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] Step 1: Getting primary monitor information",
        get_timestamp()
    );

    let monitor = app
        .primary_monitor()
        .map_err(|e| {
            let error_msg = format!("Failed to get monitor: {}", e);
            #[cfg(debug_assertions)]
            println!("[WINDOW][{}] ✗ {}", get_timestamp(), error_msg);

            #[cfg(not(debug_assertions))]
            eprintln!("[WINDOW ERROR][{}] {}", get_timestamp(), error_msg);

            error_msg
        })?
        .ok_or_else(|| {
            let error_msg = "No monitor found";
            #[cfg(debug_assertions)]
            println!("[WINDOW][{}] ✗ {}", get_timestamp(), error_msg);

            #[cfg(not(debug_assertions))]
            eprintln!("[WINDOW ERROR][{}] {}", get_timestamp(), error_msg);

            error_msg.to_string()
        })?;

    let size = monitor.size();
    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] ✓ Monitor size: {}x{}",
        get_timestamp(),
        size.width,
        size.height
    );

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] Step 2: Building window configuration",
        get_timestamp()
    );

    // Use external URL for dev
    let url = "http://localhost:1420/wallpaper.html";
    #[cfg(debug_assertions)]
    println!("[WINDOW][{}] Target URL: {}", get_timestamp(), url);

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] Creating WebviewWindowBuilder...",
        get_timestamp()
    );

    let builder = tauri::WebviewWindowBuilder::new(
        &app,
        "wallpaper",
        tauri::WebviewUrl::External(url.parse().map_err(|e| {
            let error_msg = format!("Invalid URL: {}", e);
            #[cfg(debug_assertions)]
            println!("[WINDOW][{}] ✗ {}", get_timestamp(), error_msg);

            error_msg
        })?),
    );

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] Configuring window properties:",
        get_timestamp()
    );

    #[cfg(debug_assertions)]
    println!("[WINDOW][{}]   - title: Wallpaper", get_timestamp());

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}]   - visible: false (hidden initially)",
        get_timestamp()
    );

    #[cfg(debug_assertions)]
    println!("[WINDOW][{}]   - decorations: false", get_timestamp());

    #[cfg(debug_assertions)]
    println!("[WINDOW][{}]   - skip_taskbar: true", get_timestamp());

    #[cfg(debug_assertions)]
    println!("[WINDOW][{}]   - position: (0, 0)", get_timestamp());

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}]   - size: {}x{}",
        get_timestamp(),
        size.width,
        size.height
    );

    let builder = builder
        .title("Wallpaper")
        .visible(false) // Create window hidden initially
        .decorations(false)
        .skip_taskbar(true)
        .position(0.0, 0.0)
        .inner_size(size.width as f64, size.height as f64);

    #[cfg(debug_assertions)]
    println!("[WINDOW][{}] Step 3: Building window...", get_timestamp());

    let window = builder.build().map_err(|e| {
        let error_msg = format!("Failed to build window: {}", e);
        #[cfg(debug_assertions)]
        println!("[WINDOW][{}] ✗ {}", get_timestamp(), error_msg);

        #[cfg(not(debug_assertions))]
        eprintln!("[WINDOW ERROR][{}] {}", get_timestamp(), error_msg);

        error_msg
    })?;

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] ✓ Window built successfully (hidden)",
        get_timestamp()
    );

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] Window label: {}",
        get_timestamp(),
        window.label()
    );

    // Open devtools for debugging
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
        println!(
            "[WINDOW][{}] DevTools opened for wallpaper window",
            get_timestamp()
        );
    }

    #[cfg(debug_assertions)]
    println!(
        "[WINDOW][{}] ✓ create_wallpaper_window completed successfully",
        get_timestamp()
    );

    Ok(())
}

// Helper function to get current timestamp for logging
fn get_timestamp() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default();
    format!("{}.{:03}", duration.as_secs(), duration.subsec_millis())
}

#[tauri::command]
async fn create_and_apply_wallpaper(
    app: tauri::AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    use tauri::Manager;

    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] === CREATE AND APPLY WALLPAPER CALLED ===",
        get_timestamp()
    );

    // Step 1: Create the hidden window
    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] Step 1: Creating hidden wallpaper window",
        get_timestamp()
    );

    let create_result = create_wallpaper_window(app.clone()).await;

    match &create_result {
        Ok(_) => {
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✓ Window creation completed",
                get_timestamp()
            );
        }
        Err(e) => {
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✗ Window creation failed: {}",
                get_timestamp(),
                e
            );

            #[cfg(not(debug_assertions))]
            eprintln!(
                "[WALLPAPER ERROR][{}] Window creation failed: {}",
                get_timestamp(),
                e
            );
        }
    }

    create_result?;

    // Step 2: Get the HWND from the created window
    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] Step 2: Retrieving HWND from wallpaper window",
        get_timestamp()
    );

    let wallpaper_window = app.get_webview_window("wallpaper").ok_or_else(|| {
        let error = "Wallpaper window not found after creation";
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] ✗ {}", get_timestamp(), error);

        #[cfg(not(debug_assertions))]
        eprintln!("[WALLPAPER ERROR][{}] {}", get_timestamp(), error);

        error.to_string()
    })?;

    let hwnd = wallpaper_window.hwnd().map_err(|e| {
        let error_msg = format!("Failed to get HWND: {}", e);
        #[cfg(debug_assertions)]
        println!("[WALLPAPER][{}] ✗ {}", get_timestamp(), error_msg);

        error_msg
    })?;

    let hwnd_value = hwnd.0 as isize;

    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] ✓ Retrieved wallpaper window HWND: {}",
        get_timestamp(),
        hwnd_value
    );

    // Step 3: Call set_wallpaper_window_with_retry with the HWND
    #[cfg(debug_assertions)]
    println!(
        "[WALLPAPER][{}] Step 3: Positioning wallpaper window with retry logic (max 3 attempts)",
        get_timestamp()
    );

    let mut manager = state.wallpaper_manager.lock().unwrap();
    let positioning_result = manager.set_wallpaper_window_with_retry(hwnd_value, 3);

    match positioning_result {
        Ok(_) => {
            // Step 4: Position verified successfully (done in set_wallpaper_window_with_retry)
            // Window is already shown by the Windows API in set_wallpaper_window
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✓ Step 4: Wallpaper positioning, verification, and display completed",
                get_timestamp()
            );

            drop(manager); // Release the lock

            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✓✓✓ Wallpaper applied successfully! ✓✓✓",
                get_timestamp()
            );

            Ok(())
        }
        Err(e) => {
            // Step 6: Handle errors gracefully with fallback to showing window in degraded mode
            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] ✗ Positioning failed after all retries: {}",
                get_timestamp(),
                e
            );

            #[cfg(not(debug_assertions))]
            eprintln!(
                "[WALLPAPER ERROR][{}] Failed to position wallpaper: {}",
                get_timestamp(),
                e
            );

            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] Fallback: Attempting to show window in degraded mode",
                get_timestamp()
            );

            drop(manager); // Release the lock before showing window

            // Show the window anyway (degraded mode - may appear on top)
            let show_result = wallpaper_window.show();

            match &show_result {
                Ok(_) => {
                    #[cfg(debug_assertions)]
                    println!(
                        "[WALLPAPER][{}] ✓ Window shown in degraded mode (may appear on top)",
                        get_timestamp()
                    );
                }
                Err(e) => {
                    #[cfg(debug_assertions)]
                    println!(
                        "[WALLPAPER][{}] ✗ Failed to show window even in degraded mode: {}",
                        get_timestamp(),
                        e
                    );

                    #[cfg(not(debug_assertions))]
                    eprintln!(
                        "[WALLPAPER ERROR][{}] Failed to show window: {}",
                        get_timestamp(),
                        e
                    );
                }
            }

            show_result.map_err(|e| format!("Failed to show window in degraded mode: {}", e))?;

            #[cfg(debug_assertions)]
            println!(
                "[WALLPAPER][{}] Operation completed with degraded positioning",
                get_timestamp()
            );

            // Return the error to inform the user
            Err(format!("Wallpaper shown but positioning failed: {}", e))
        }
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            wallpaper_manager: Mutex::new(WallpaperManager::new()),
        })
        .invoke_handler(tauri::generate_handler![
            apply_wallpaper,
            remove_wallpaper,
            create_wallpaper_window,
            create_and_apply_wallpaper
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
