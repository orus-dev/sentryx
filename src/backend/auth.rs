use dioxus::prelude::*;

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct User {
    username: String,
    password: String,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct Session {
    uuid: String,
}

#[server]
pub async fn login(username: String, password: String) -> Result<String, ServerFnError> {
    let users = crate::backend::get_mongo::<mongodb::bson::Document>("users").await?;

    match users
        .find_one(mongodb::bson::doc! {
            "username": username,
            "password": password,
        })
        .await?
    {
        Some(v) => {
            let sessions = crate::backend::get_mongo::<Session>("sessions").await?;
            if let mongodb::bson::Bson::ObjectId(id) = sessions
                .insert_one(Session {
                    uuid: v.get_object_id("_id")?.to_hex(),
                })
                .await?
                .inserted_id
            {
                Ok(id.to_hex())
            } else {
                Err(ServerFnError::new(format!("Unable to extract session id")))
            }
        }
        None => Err(ServerFnError::new(format!("Invalid credentials"))),
    }
}

#[cfg(feature = "server")]
pub async fn validate_session(id: String) -> bool {
    use mongodb::bson::oid::ObjectId;

    if let Ok(sessions) = crate::backend::get_mongo::<Session>("sessions").await {
        if let Some(obj_id) = ObjectId::parse_str(id).ok() {
            match sessions
                .find_one(mongodb::bson::doc! {
                    "_id": obj_id,
                })
                .await
            {
                Ok(Some(_)) => true,
                _ => false,
            }
        } else {
            false
        }
    } else {
        false
    }
}
