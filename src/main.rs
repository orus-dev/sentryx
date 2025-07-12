mod backend;
mod components;
mod cookie;
mod dashboard;
mod login;
mod settings;

use dioxus::prelude::*;
use web_sys::window;

use dashboard::Dashboard;
use login::Login;
use settings::Settings;

#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
enum Route {
    #[route("/")]
    Login {},
    #[route("/dashboard")]
    Dashboard {},
    #[route("/settings")]
    Settings {},
}

const FAVICON: Asset = asset!("/assets/favicon.ico");
const FONT_CSS: Asset = asset!("/assets/styles/font.css");
const THEME_CSS: Asset = asset!("/assets/styles/theme.css");

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let theme = use_signal(|| String::from("light"));

    use_effect({
        let mut theme = theme.clone();
        move || {
            theme.set(cookie::get_cookie("theme").unwrap_or_default());
        }
    });

    use_effect({
        let theme = theme.clone();
        move || {
            if let Some(document) = window().and_then(|w| w.document()) {
                if let Some(html) = document.document_element() {
                    html.set_class_name(&*theme.read());
                }
            }
        }
    });

    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: FONT_CSS }
        document::Link { rel: "stylesheet", href: THEME_CSS }
        Router::<Route> { }
    }
}
