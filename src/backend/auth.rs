use dioxus::prelude::*;

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct User {
    username: String,
    password: String,
}

#[server]
pub async fn login(username: String, password: String) -> Result<String, ServerFnError> {
    let users = crate::backend::get_mongo::<User>("users").await?;

    match users
        .find_one(mongodb::bson::doc! {
            "username": username,
            "password": password,
        })
        .await?
    {
        Some(v) => Ok(String::new()),
        None => Err(ServerFnError::new(format!("Invalid credentials"))),
    }
}
