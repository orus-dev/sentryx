use dioxus::prelude::*;

use crate::Route;

const SIDEBAR_CSS: Asset = asset!("/assets/styles/sidebar.css");

pub struct SideBarItem {
    pub name: &'static str,
    pub icon: fn() -> Element,
    pub route: Route,
}

const SIDEBAR_ITEMS: &[SideBarItem] = &[
    SideBarItem {
        name: "Dashboard",
        icon: || rsx!(lucide_dioxus::Gauge { size: 35 }),
        route: Route::Dashboard {},
    },
    SideBarItem {
        name: "Settings",
        icon: || rsx!(lucide_dioxus::Settings { size: 35 }),
        route: Route::Dashboard {},
    },
];

#[component]
pub fn SideBar(selected: usize) -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: SIDEBAR_CSS }

        div {
            id: "sidebar",

            for (i, itm) in SIDEBAR_ITEMS.iter().enumerate() {
                Link {
                    to: itm.route.clone(),
                    class: if i == selected {"sidebar-item sidebar-selected"} else {"sidebar-item"},

                    {(itm.icon)()}

                    p { "{itm.name}" }
                }
            }
        }
    }
}
