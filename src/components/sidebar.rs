use dioxus::prelude::*;

use crate::Route;

const SIDEBAR_CSS: Asset = asset!("/assets/styles/sidebar.css");

pub struct SideBarItem {
    pub name: &'static str,
    pub icon: Asset,
    pub icon_selected: Asset,
    pub route: Route,
}

const SIDEBAR_ITEMS: &[SideBarItem] = &[
    SideBarItem {
        name: "Dashboard",
        icon: asset!("/assets/sidebar/dashboard.svg"),
        icon_selected: asset!("/assets/sidebar/dashboard-selected.svg"),
        route: Route::Dashboard {},
    },
    SideBarItem {
        name: "Dashboard",
        icon: asset!("/assets/sidebar/dashboard.svg"),
        icon_selected: asset!("/assets/sidebar/dashboard-selected.svg"),
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
                    class: "sidebar-item",

                    if selected == i {
                        img { src: itm.icon_selected, width: "45" }
                    } else {
                        img { src: itm.icon, width: "45" }
                    }

                    p { "{itm.name}" }
                }
            }
        }
    }
}
