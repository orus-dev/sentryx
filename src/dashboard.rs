use dioxus::prelude::*;

use crate::components::{sidebar::SideBar, LineChart, ProgressBar};
use lucide_dioxus;

const DASHBOARD_CSS: Asset = asset!("/assets/dashboard.css");

#[component]
pub fn Dashboard() -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: DASHBOARD_CSS }

        div { class: "sidebar-container",
            SideBar { selected: 0 }

            div { class: "dashboard-container",
                div { class: "summary-container",
                    div { class: "summary-card", id: "online",
                        div {
                            p { "Online Servers" }
                            h3 { "3" }
                        }
                        lucide_dioxus::CircleCheckBig { size: 32, color: "currentColor" }
                    }

                    div { class: "summary-card", id: "issues",
                        div {
                            p { "Issues" }
                            h3 { "2" }
                        }
                        lucide_dioxus::TriangleAlert { size: 32, color: "currentColor" }
                    }

                    div { class: "summary-card", id: "cpu",
                        div {
                            p { "Avg CPU Usage" }
                            h3 { "42%" }
                        }
                        lucide_dioxus::Cpu { size: 32, color: "currentColor" }
                    }

                    div { class: "summary-card", id: "ram",
                        div {
                            p { "Avg Memory" }
                            h3 { "42%" }
                        }
                        lucide_dioxus::MemoryStick { size: 32, color: "currentColor" }
                    }
                }

                div { class: "overview-container",
                    div { class: "performance-card",
                        LineChart { data: vec![90, 20, 40, 90, 60], max: 100 }
                    }

                    div { class: "overview-card",
                        h2 {
                            lucide_dioxus::Activity { size: 22, color: "currentColor" }
                            "System Overview"
                        }
                        div { p { "Average CPU" } p { "10%" } }
                        ProgressBar { percent: 10, id: "cpu" }

                        div { p { "Average Memory" } p { "24%" } }
                        ProgressBar { percent: 10, id: "ram" }

                        div { p { "Average Storage" } p { "24%" } }
                        ProgressBar { percent: 10, id: "issues" }
                    }
                }

                div { class: "search-container",
                    div { class: "search-input",
                        lucide_dioxus::Search { size: 16, color: "currentColor" }
                        input { placeholder: "Search servers by name, location, or IP..." }
                    }
                    button { "All (4)" }
                    button { id: "online", "Online (3)" }
                    button { id: "issues", "Warning (1)" }
                    button { id: "ram", "Offline (1)" }
                    button { id: "cpu", "Maintenance (1)" }
                }

                div { class: "server-container",
                    div {
                        h3 { "Web server 01" }
                    }

                    div {
                        h3 { "Web server 01" }
                    }

                    div {
                        h3 { "Web server 01" }
                    }
                }
            }
        }
    }
}
