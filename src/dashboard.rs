use dioxus::prelude::*;

const DASHBOARD_CSS: Asset = asset!("/assets/dashboard.css");

#[component]
pub fn Dashboard() -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: DASHBOARD_CSS }

        div {
            class: "container",

            div { id: "sidebar" }
            div {
                class: "left_container",
                div { id: "top_container" }
                div { id: "mid_container" }
                div { id: "bottom_container" }
            }
            div {
                class: "right_container",
                div { class: "right_box" }
                div { class: "right_box" }
            }
        }
    }
}
