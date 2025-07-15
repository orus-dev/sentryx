pub mod auth;

use crate::components::server::Server;
use dioxus::prelude::*;

#[cfg(feature = "server")]
use futures_util::stream::TryStreamExt;

#[cfg(feature = "server")]
const DB_URL: &'static str = "mongodb://admin:admin@localhost/";

#[cfg(feature = "server")]
pub async fn get_mongo<T: Send + Sync>(
    collection: &str,
) -> Result<mongodb::Collection<T>, mongodb::error::Error> {
    let client = mongodb::Client::with_uri_str(DB_URL).await?;

    Ok(client.database("sentryx").collection(collection))
}

#[cfg(feature = "server")]
fn parse_search_query(input: &str) -> Vec<String> {
    let re = regex::Regex::new(r#""([^"]+)"|(\S+)"#).unwrap();

    re.captures_iter(input)
        .filter_map(|cap| cap.get(1).or_else(|| cap.get(2)))
        .map(|m| m.as_str().to_string())
        .collect()
}

#[cfg(feature = "server")]
fn build_or_filter(input: &str, fields: &[&str]) -> mongodb::bson::Document {
    let phrases = parse_search_query(input);
    let mut or_clauses = Vec::new();

    for phrase in phrases {
        for &field in fields {
            or_clauses.push(mongodb::bson::doc! {
                field: mongodb::bson::Regex {
                    pattern: phrase.clone(),
                    options: "i".into(), // case-insensitive
                }
            });
        }
    }

    mongodb::bson::doc! { "$or": or_clauses }
}

#[server]
pub async fn get_servers(session: String, search: String) -> Result<Vec<Server>, ServerFnError> {
    if !auth::validate_session(session).await {
        return Err(ServerFnError::new(format!("Invalid session")));
    }

    let servers = get_mongo::<Server>("servers").await?;

    let filter = if search.trim().is_empty() {
        mongodb::bson::doc! {}
    } else {
        build_or_filter(&search, &["name", "ip"])
    };

    let mut cursor = servers.find(filter).await?;

    let mut svo = Vec::new();

    while let Some(doc) = cursor.try_next().await? {
        svo.push(doc);
    }

    Ok(svo)
}
