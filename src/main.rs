mod backend;
mod dashboard;
mod login;

use dioxus::prelude::*;

use dashboard::Dashboard;
use login::Login;

#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
enum Route {
    #[route("/")]
    Login {},
    #[route("/dashboard")]
    Dashboard {},
}

const FAVICON: Asset = asset!("/assets/favicon.ico");
const FONT_CSS: Asset = asset!("/assets/font.css");

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: FONT_CSS }
        Router::<Route> {}
    }
}
