use dioxus::prelude::*;

use crate::components::LineChart;

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
                div { id: "mid_container",
                    LineChart { data: vec![90, 60, 70, 50], max: 170, start_opacity: 0.3 }
                }
                div { id: "bottom_container" }
            }
            div {
                class: "right_container",
                div { class: "right_box",
                    LineChart { data: vec![90, 60, 70, 50], max: 170, start_opacity: 0.3 }
                }
                div { class: "right_box",
                    LineChart { data: vec![90, 60, 70, 50], max: 170, start_opacity: 0.3 }
                }
            }
        }
    }
}
