use crate::components::ProgressBar;
use dioxus::prelude::*;

const SERVER_CSS: Asset = asset!("/assets/styles/server.css");

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum Status {
    Online,
    Offline,
    Warning,
    Maintenance,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct Server {
    pub name: String,
    pub status: Status,
    pub ip: String,
    pub cpu: u8,
    pub memory: u8,
    pub storage: u8,
    pub network: u8,
}

impl std::fmt::Display for Status {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Status::Online => write!(f, "Online"),
            Status::Warning => write!(f, "Warning"),
            Status::Offline => write!(f, "Offline"),
            Status::Maintenance => write!(f, "Maintenance"),
        }
    }
}

#[component]
pub fn ServerComponent(server: Server) -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: SERVER_CSS }

        div { class: "server",
            div { class: "server-heading",
                div { class: "server-heading-inner",
                    div { class: "server-icon",
                        lucide_dioxus::Server { size: 20, color: "currentColor" }
                    }
                    div { class: "server-heading-info",
                        h3 { "{server.name}" }
                        div {
                            div { class: "{server.status}",
                                lucide_dioxus::CircleCheckBig { size: 12, color: "currentColor" }
                                p { "{server.status}" }
                            }
                            p { "{server.ip}" }
                        }
                    }
                }

                button { lucide_dioxus::EllipsisVertical { size: 16, color: "currentColor" } }
            }

            div { class: "server-monitor",
                div { p {
                    lucide_dioxus::Cpu { size: 16, color: "currentColor", class: "cpu" }
                    "CPU"
                } p { "{server.cpu}%" } }
                ProgressBar { percent: server.cpu, class: get_level(server.cpu) }

                div { p {
                    lucide_dioxus::MemoryStick { size: 16, color: "currentColor", class: "ram" }
                    "Memory"
                } p { "{server.memory}%" } }
                ProgressBar { percent: server.memory, class: get_level(server.memory) }

                div { p {
                    lucide_dioxus::HardDrive { size: 16, color: "currentColor", class: "storage" }
                    "Storage"
                } p { "{server.storage}%" } }
                ProgressBar { percent: server.storage, class: get_level(server.storage) }

                div { p {
                    lucide_dioxus::Wifi { size: 16, color: "currentColor", class: "network" }
                    "Network"
                } p { "{server.network}%" } }
                ProgressBar { percent: server.network, class: get_level(server.network) }
            }
        }
    }
}

fn get_level(i: u8) -> String {
    if i > 80 {
        String::from("high")
    } else if i > 30 {
        String::from("medium")
    } else {
        String::from("low")
    }
}
