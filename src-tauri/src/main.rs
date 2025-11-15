#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod wallpaper;

use std::sync::Mutex;
use tauri::{Manager, State, Window};
use wallpaper::WallpaperManager;

struct AppState {
    wallpaper_manager: Mutex<WallpaperManager>,
}

#[tauri::command]
fn apply_wallpaper(window: Window, state: State<AppState>) -> Result<(), String> {
    let hwnd = window.hwnd().map_err(|e| e.to_string())?;
    let mut manager = state.wallpaper_manager.lock().unwrap();
    manager.set_wallpaper_window(hwnd.0 as isize)
}

#[tauri::command]
fn remove_wallpaper(state: State<AppState>) -> Result<(), String> {
    let mut manager = state.wallpaper_manager.lock().unwrap();
    manager.remove_wallpaper()
}

#[tauri::command]
fn create_wallpaper_window(app: tauri::AppHandle) -> Result<(), String> {
    tauri::WebviewWindowBuilder::new(
        &app,
        "wallpaper",
        tauri::WebviewUrl::App("wallpaper".into()),
    )
    .title("Wallpaper")
    .decorations(false)
    .transparent(true)
    .always_on_bottom(true)
    .skip_taskbar(true)
    .build()
    .map_err(|e| e.to_string())?;
    
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
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
