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
                        LineChart { data: vec![90, 20, 40, 90, 60], max: 100 }
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
                    button { "All (4)" }
                    button { class: "online", "Online (3)" }
                    button { class: "issues", "Warning (1)" }
                    button { class: "ram", "Offline (1)" }
                    button { class: "cpu", "Maintenance (1)" }
                }

                div { class: "server-container",
                    div { class: "server",
                        div { class: "server-heading",
                            div { class: "server-heading-inner",
                                div { class: "server-icon",
                                    lucide_dioxus::Server { size: 20, color: "currentColor" }
                                }
                                div { class: "server-heading-info",
                                    h3 { "Web server 01" }
                                    div {
                                        div {
                                            lucide_dioxus::CircleCheckBig { size: 12, color: "currentColor" }
                                            p { "Online" }
                                        }
                                        p { "10.7.1.21" }
                                    }
                                }
                            }

                            button { lucide_dioxus::EllipsisVertical { size: 16, color: "currentColor" } }
                        }

                        div { class: "server-monitor",
                            div { p {
                                lucide_dioxus::Cpu { size: 16, color: "currentColor", class: "cpu" }
                                "CPU"
                            } p { "10%" } }
                            ProgressBar { percent: 10, class: "low" }

                            div { p {
                                lucide_dioxus::MemoryStick { size: 16, color: "currentColor", class: "ram" }
                                "Memory"
                            } p { "34%" } }
                            ProgressBar { percent: 60, class: "medium" }

                            div { p {
                                lucide_dioxus::HardDrive { size: 16, color: "currentColor", class: "storage" }
                                "Storage"
                            } p { "80%" } }
                            ProgressBar { percent: 80, class: "high" }

                            div { p {
                                lucide_dioxus::Wifi { size: 16, color: "currentColor", class: "network" }
                                "Network"
                            } p { "34%" } }
                            ProgressBar { percent: 34, class: "low" }
                        }
                    }
                }
            }
        }
    }
}
