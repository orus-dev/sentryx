use dioxus::prelude::*;

use crate::{backend, utils};

const LOGIN_CSS: Asset = asset!("/assets/styles/login.css");

#[component]
pub fn Login() -> Element {
    let username = use_signal(|| String::new());
    let password = use_signal(|| String::new());

    let is_disabled = {
        let username = username.clone();
        let password = password.clone();
        move || username().is_empty() || password().is_empty()
    };

    let log_in = {
        let username = username.clone();
        let password = password.clone();
        move || async move {
            if username().is_empty() || password().is_empty() {
                return;
            }
            match backend::log_in(username.read().clone(), password.read().clone()).await {
                Ok(id) => {
                    utils::set_cookie("session_id", &id);
                    utils::redirect("/dashboard");
                }
                Err(_) => {}
            }
        }
    };

    rsx! {
        document::Link { rel: "stylesheet", href: LOGIN_CSS }

        div {
            id: "login_wrapper",
            onkeypress: move |e: Event<KeyboardData>| async move {
                if e.key() == Key::Enter {
                    log_in().await;
                }
            },
            tabindex: "0",

            img {
                id: "background_img",
                src: asset!("assets/background.svg")
            }

            div {
                id: "login_container",
                h1 { "Login" }

                div {
                    p { "Username" }
                    input { onchange: {let mut username = username.clone(); move |e: Event<FormData>| {username.set(e.value())}}, class: "field" }
                }
                div{
                    p { "Password" }
                    input {
                        class: "field",
                        onchange: {
                            let mut password = password.clone();
                            move |e: Event<FormData>| {password.set(e.value())}
                        },
                    }
                }

                button {
                    disabled: is_disabled(),
                    onclick: move |_| log_in(),
                    "Login"
                }
            }
        }
    }
}
