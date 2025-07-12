use dioxus::prelude::*;

use crate::{components::sidebar::SideBar, cookie};

pub enum Property {
    Dropdown(&'static [&'static str]),
}

const SETTINGS_CSS: Asset = asset!("/assets/styles/settings.css");
const OPTIONS: &[(&str, Property, bool)] = &[(
    "theme",
    Property::Dropdown(&["light", "dark", "black"]),
    true,
)];

#[component]
pub fn Settings() -> Element {
    rsx! {
        document::Link { rel: "stylesheet", href: SETTINGS_CSS }

        div { class: "sidebar-container",
            SideBar { selected: 1 }

            div { class: "settings-container",
                div {
                    for (name, prop, needs_refresh) in OPTIONS {
                        match prop {
                            Property::Dropdown(opts) => {
                                rsx!{
                                    div { class: "dropdown-wrapper",
                                        button { class: "dropdown-button", onclick: |_| {
                                            let Some(document) = web_sys::window().and_then(|w| w.document()) else {
                                                return;
                                            };
                                            let e = document.get_element_by_id(name).unwrap();
                                            if e.class_name() == "dropdown" {
                                                e.set_class_name("dropdown dropdown-none");
                                            } else {
                                                e.set_class_name("dropdown");
                                            }
                                        },
                                            "{name}"
                                            lucide_dioxus::ChevronDown { size: 16, class: "chevron", color: "currentColor" }
                                        }
                                        div {
                                            id: "{name}",
                                            class: "dropdown",
                                            for o in opts {
                                                button { onclick: move |_| {
                                                    cookie::set_cookie(name, &o);
                                                    if *needs_refresh {
                                                        if let Some(win) = web_sys::window() {
                                                            win.location().reload().unwrap();
                                                        }
                                                    }
                                                }, "{o}" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
