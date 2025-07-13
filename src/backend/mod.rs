use dioxus::prelude::*;

use crate::components::server::Server;

#[server]
pub async fn log_in(username: String, password: String) -> Result<String, ServerFnError> {
    Ok(format!("{username}@{password}"))
}

#[server]
pub async fn get_servers() -> Result<Vec<Server>, ServerFnError> {
    Ok(vec![
        Server {
            name: "Main Server".to_string(),
            status: crate::components::server::Status::Online,
            ip: "10.0.0.5".to_string(),
            cpu: 95,
            memory: 60,
            storage: 43,
            network: 88,
        },
        Server {
            name: "Cache Node".to_string(),
            status: crate::components::server::Status::Warning,
            ip: "192.168.1.12".to_string(),
            cpu: 47,
            memory: 72,
            storage: 81,
            network: 34,
        },
        Server {
            name: "Database".to_string(),
            status: crate::components::server::Status::Offline,
            ip: "172.16.254.3".to_string(),
            cpu: 12,
            memory: 90,
            storage: 22,
            network: 10,
        },
        Server {
            name: "Backup Node".to_string(),
            status: crate::components::server::Status::Maintenance,
            ip: "192.168.100.22".to_string(),
            cpu: 83,
            memory: 41,
            storage: 96,
            network: 70,
        },
    ])
}
