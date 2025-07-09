use dioxus::prelude::*;

#[component]
pub fn Login() -> Element {
    rsx! {
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

                button { "Login" }
            }
        }
    }
}
