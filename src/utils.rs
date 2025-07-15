use dioxus::prelude::*;
use std::str::FromStr;
use wasm_bindgen::JsCast;
use web_sys::{window, HtmlDocument};

use crate::{backend, components::server::Server};

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

pub fn use_cookie<T: FromStr + 'static>(name: &str, default: fn() -> T) -> Signal<T> {
    let name = name.to_string();
    let signal = use_signal(default);

    use_effect({
        let mut signal = signal.clone();
        move || {
            if let Some(c) = get_cookie(&name) {
                if let Ok(cv) = T::from_str(&c) {
                    signal.set(cv);
                }
            }
        }
    });

    signal
}

pub fn redirect(target: &str) {
    web_sys::window()
        .unwrap()
        .location()
        .set_href(target)
        .unwrap();
}

pub struct Session(Signal<String>);

pub fn use_session() -> Session {
    Session(use_cookie("session_id", || String::new()))
}

impl Session {
    pub fn use_servers(&self) -> (Signal<Vec<Server>>, Signal<String>) {
        let query = use_signal(|| String::new());
        let servers = use_signal(|| Vec::new());
        let id = self.0.clone();

        use_effect(move || {
            let query_value = query.read().clone();
            let mut servers = servers.clone();

            spawn(async move {
                if let Ok(v) = backend::get_servers(id.read().clone(), query_value).await {
                    servers.set(v);
                }
            });
        });

        (servers, query)
    }
}
