use dioxus::prelude::*;

use crate::Route;

const LOGIN_CSS: Asset = asset!("/assets/login.css");

#[component]
pub fn Login() -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: LOGIN_CSS }

        div {
            id: "login_wrapper",

            img {
                id: "background_img",
                src: asset!("assets/background.svg")
            }

            div {
                id: "login_container",
                h1 { "Login" }

                div {
                    p { "Username" }
                    input { class: "field" }
                }
                div{
                    p { "Password" }
                    input { class: "field" }
                }

                Link {
                    to: Route::Dashboard {  },
                    button { "Login" }
                }
            }
        }
    }
}
