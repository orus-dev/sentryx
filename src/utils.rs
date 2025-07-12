use dioxus::prelude::use_navigator;
use wasm_bindgen::JsCast;
use web_sys::{window, HtmlDocument};

pub fn set_cookie(name: &str, value: &str) {
    let Some(document) = window().and_then(|w| w.document()) else {
        return;
    };

    let Ok(html_doc) = document.dyn_into::<HtmlDocument>() else {
        return;
    };

    let cookie = format!("{name}={value}; path=/");
    let _ = html_doc.set_cookie(&cookie);
}

pub fn get_cookie(name: &str) -> Option<String> {
    let Some(document) = window().and_then(|w| w.document()) else {
        return None;
    };
    let Ok(html_doc) = document.dyn_into::<HtmlDocument>() else {
        return None;
    };

    let Ok(cookie_string) = html_doc.cookie() else {
        return None;
    };
    for cookie in cookie_string.split(';') {
        let cookie = cookie.trim();
        if let Some((k, v)) = cookie.split_once('=') {
            if k == name {
                return Some(v.to_string());
            }
        }
    }
    None
}

pub fn redirect(target: &str) {
    use_navigator().push(target);
}
