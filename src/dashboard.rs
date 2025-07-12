use dioxus::prelude::*;

use crate::components::{
    server::{Server, ServerComponent},
    sidebar::SideBar,
    LineChart, ProgressBar,
};
use lucide_dioxus;

const DASHBOARD_CSS: Asset = asset!("/assets/styles/dashboard.css");

#[component]
pub fn Dashboard() -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: DASHBOARD_CSS }

        div { class: "sidebar-container",
            SideBar { selected: 0 }

            div { class: "dashboard-container",
                div { class: "summary-container",
                    div { class: "summary-card", class: "online",
                        div {
                            p { "Online Servers" }
                            h3 { "3" }
                        }
                        lucide_dioxus::CircleCheckBig { size: 32, color: "currentColor" }
                    }

                    div { class: "summary-card", class: "issues",
                        div {
                            p { "Issues" }
                            h3 { "2" }
                        }
                        lucide_dioxus::TriangleAlert { size: 32, color: "currentColor" }
                    }

                    div { class: "summary-card", class: "cpu",
                        div {
                            p { "Avg CPU Usage" }
                            h3 { "42%" }
                        }
                        lucide_dioxus::Cpu { size: 32, color: "currentColor" }
                    }

                    div { class: "summary-card", class: "ram",
                        div {
                            p { "Avg Memory" }
                            h3 { "42%" }
                        }
                        lucide_dioxus::MemoryStick { size: 32, color: "currentColor" }
                    }
                }

                div { class: "overview-container",
                    div { class: "performance-card",
                        div { class: "performance-stack",
                            LineChart { data: vec![30, 30, 30, 70, 30], max: 100, class: "lc1" }
                            LineChart { data: vec![47, 50, 60, 30, 50], max: 100, class: "lc2" }
                            LineChart { data: vec![23, 50, 40, 50, 52], max: 100, class: "lc3" }
                        }
                    }

                    div { class: "overview-card",
                        h2 {
                            lucide_dioxus::Activity { size: 22, color: "currentColor" }
                            "System Overview"
                        }
                        div { p { "Average CPU" } p { "10%" } }
                        ProgressBar { percent: 10, class: "cpu" }

                        div { p { "Average Memory" } p { "24%" } }
                        ProgressBar { percent: 10, class: "ram" }

                        div { p { "Average Storage" } p { "24%" } }
                        ProgressBar { percent: 10, class: "storage" }

                        div { p { "Average Network" } p { "24%" } }
                        ProgressBar { percent: 10, class: "network" }
                    }
                }

                div { class: "search-container",
                    div { class: "search-input",
                        lucide_dioxus::Search { size: 16, color: "currentColor" }
                        input { placeholder: "Search servers by name, location, or IP..." }
                    }
                    button { class: "fg", "All (4)" }
                    button { class: "online", "Online (3)" }
                    button { class: "issues", "Warning (1)" }
                    button { class: "ram", "Offline (1)" }
                    button { class: "cpu", "Maintenance (1)" }
                }

                div { class: "server-container",
                    ServerComponent { server: Server {
                        name: "Main Server".to_string(),
                        status: crate::components::server::Status::Online,
                        ip: "10.0.0.5".to_string(),
                        cpu: 95,
                        memory: 60,
                        storage: 43,
                        network: 88,
                    } }

                    ServerComponent { server: Server {
                        name: "Cache Node".to_string(),
                        status: crate::components::server::Status::Warning,
                        ip: "192.168.1.12".to_string(),
                        cpu: 47,
                        memory: 72,
                        storage: 81,
                        network: 34,
                    } }

                    ServerComponent { server: Server {
                        name: "Database".to_string(),
                        status: crate::components::server::Status::Offline,
                        ip: "172.16.254.3".to_string(),
                        cpu: 12,
                        memory: 90,
                        storage: 22,
                        network: 10,
                    } }

                    ServerComponent { server: Server {
                        name: "Backup Node".to_string(),
                        status: crate::components::server::Status::Maintenance,
                        ip: "192.168.100.22".to_string(),
                        cpu: 83,
                        memory: 41,
                        storage: 96,
                        network: 70,
                    } }
                }
            }
        }
    }
}
