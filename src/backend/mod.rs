use dioxus::prelude::*;

#[server]
pub async fn log_in(username: String, password: String) -> Result<String, ServerFnError> {
    Ok(format!("{username}@{password}"))
}
