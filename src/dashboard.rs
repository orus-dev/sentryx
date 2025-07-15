use dioxus::prelude::*;

use crate::components::{server::ServerComponent, sidebar::SideBar, LineChart, ProgressBar};
use lucide_dioxus;

const DASHBOARD_CSS: Asset = asset!("/assets/styles/dashboard.css");

#[component]
pub fn Dashboard() -> Element {
    let session = crate::utils::use_session();
    let (servers, server_query) = session.use_servers();

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
                        div { class: "chart-container",
                            div { class: "y-axis",
                                {(0..=100).rev().step_by(25).map(|v| rsx!(div { "{v}" }))}
                            }
                            div { class: "chart-area",
                                div { class: "performance-stack",
                                    LineChart { data: vec![30, 35, 23, 21, 32, 40, 53, 61, 47, 36, 26, 18], max: 100, class: "lc1" }
                                    LineChart { data: vec![47, 50, 60, 30, 50], max: 100, class: "lc2" }
                                    LineChart { data: vec![23, 50, 40, 50, 52], max: 100, class: "lc3" }
                                }
                                div { class: "x-axis",
                                    {(0..24).step_by(2).map(|h| rsx!(div { "{h}h" }))}
                                }
                            }
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
                        input {
                            onchange: {let mut server_query = server_query.clone(); move |e: Event<FormData>| {server_query.set(e.value())}},

                            placeholder: "Search servers by name, location, or IP..." }
                    }
                    button { class: "All", "All (4)" }
                    button { class: "Online", "Online (3)" }
                    button { class: "Warning", "Warning (1)" }
                    button { class: "Offline", "Offline (1)" }
                    button { class: "Maintenance", "Maintenance (1)" }
                }

                div { class: "server-container",
                    for s in (*servers.read()).clone() {
                        ServerComponent { server: s }
                    }
                }
            }
        }
    }
}
