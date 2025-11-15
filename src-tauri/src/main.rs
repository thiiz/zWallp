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

    let wallpaper_window = app
        .get_webview_window("wallpaper")
        .ok_or("Wallpaper window not found")?;

    let hwnd = wallpaper_window.hwnd().map_err(|e| e.to_string())?;
    let mut manager = state.wallpaper_manager.lock().unwrap();
    manager.set_wallpaper_window(hwnd.0 as isize)
}

#[tauri::command]
fn remove_wallpaper(state: State<AppState>) -> Result<(), String> {
    let mut manager = state.wallpaper_manager.lock().unwrap();
    manager.remove_wallpaper()
}

#[tauri::command]
async fn create_wallpaper_window(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;

    println!("=== CREATE WALLPAPER WINDOW CALLED ===");

    // Check if window already exists
    if let Some(existing) = app.get_webview_window("wallpaper") {
        println!("Wallpaper window already exists, showing it");
        existing.show().map_err(|e| e.to_string())?;
        return Ok(());
    }

    println!("Creating new wallpaper window");

    let monitor = app
        .primary_monitor()
        .map_err(|e| format!("Failed to get monitor: {}", e))?
        .ok_or("No monitor found")?;

    let size = monitor.size();
    println!("Monitor size: {}x{}", size.width, size.height);

    println!("Building window with URL: wallpaper.html");
    
    // Use external URL for dev
    let url = "http://localhost:1420/wallpaper.html";
    println!("Using URL: {}", url);
    
    println!("About to call WebviewWindowBuilder::new...");
    
    let builder = tauri::WebviewWindowBuilder::new(
        &app,
        "wallpaper",
        tauri::WebviewUrl::External(url.parse().map_err(|e| format!("Invalid URL: {}", e))?),
    );
    
    println!("Builder created, setting title...");
    let builder = builder.title("Wallpaper");
    
    println!("Calling build()...");
    let window = builder.build().map_err(|e| {
        eprintln!("ERROR building window: {}", e);
        format!("Failed to build window: {}", e)
    })?;
    
    println!("Window built successfully!");
    
    // Now configure it
    println!("Configuring window...");
    window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
        width: size.width,
        height: size.height,
    })).ok();
    window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
        x: 0,
        y: 0,
    })).ok();
    window.set_decorations(false).ok();
    window.set_skip_taskbar(true).ok();

    println!("Wallpaper window created successfully");
    println!("Window label: {}", window.label());
    
    // Open devtools for debugging
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
        println!("DevTools opened for wallpaper window");
    }
    
    Ok(())
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
            create_wallpaper_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
