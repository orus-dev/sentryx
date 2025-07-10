use dioxus::prelude::*;

#[component]
pub fn LineChart(
    data: Vec<i32>,
    max: Option<i32>,
    start_color: Option<u32>,
    start_opacity: Option<f32>,
    end_color: Option<u32>,
    end_opacity: Option<f32>,
) -> Element {
    let width = 300.0;
    let height = 200.0;
    let start_color = start_color.unwrap_or(0x4f46e5);
    let start_opacity = start_opacity.unwrap_or(0.4);
    let end_color = end_color.unwrap_or(0x4f46e5);
    let end_opacity = end_opacity.unwrap_or(0.0);

    let max_y = max
        .map(|v| v as f64)
        .unwrap_or_else(|| *data.iter().max().unwrap_or(&100) as f64);

    let points: Vec<(f64, f64)> = data
        .iter()
        .enumerate()
        .map(|(i, &y)| {
            let x = i as f64 / (data.len() - 1).max(1) as f64 * width;
            let y = height - (y as f64 / max_y * height);
            (x, y)
        })
        .collect();

    let path_data = {
        let mut d = format!("M {} {}", points[0].0, points[0].1);
        for &(x, y) in &points[1..] {
            d += &format!(" L {} {}", x, y);
        }
        d
    };

    let fill_path_data = {
        let mut d = format!("M {} {}", points[0].0, height);
        for &(x, y) in &points {
            d += &format!(" L {} {}", x, y);
        }
        d += &format!(" L {} {}", points.last().unwrap().0, height);
        d + " Z"
    };

    rsx! {
        div {
            class: "line-chart",
            svg {
                preserve_aspect_ratio: "none",
                class: "line-chart-svg",
                width: "{width}",
                height: "{height}",
                view_box: "0 0 {width} {height}",
                xmlns: "http://www.w3.org/2000/svg",

                defs {
                    linearGradient {
                        id: "gradient-fill",
                        x1: "0",
                        y1: "0",
                        x2: "0",
                        y2: "1",

                        stop {
                            offset: "0%",
                            stop_color: "#{start_color:06X}",
                            stop_opacity: "{start_opacity}",
                        }
                        stop {
                            offset: "100%",
                            stop_color: "#{end_color:06X}",
                            stop_opacity: "{end_opacity}",
                        }
                    }
                }

                path {
                    class: "fill",
                    d: "{fill_path_data}",
                    fill: "url(#gradient-fill)"
                }

                path {
                    class: "line",
                    d: "{path_data}",
                    fill: "none",
                    stroke: "#4f46e5",
                    stroke_width: "2"
                }
            }
        }
    }
}

const RADIUS: f64 = 50.0;
const CIRCUMFERENCE: f64 = 2.0 * std::f64::consts::PI * RADIUS;

#[component]
pub fn RadialChart(percent: f64) -> Element {
    let offset = CIRCUMFERENCE * (1.0 - percent.clamp(0.0, 1.0));

    rsx! {
        svg {
            width: "140",
            height: "140",
            view_box: "0 0 120 120",
            xmlns: "http://www.w3.org/2000/svg",

            // Outline circle
            circle {
                cx: "60",
                cy: "60",
                r: "{RADIUS}",
                stroke: "none",
                stroke_width: "10.0",
                fill: "none",
            }

            // Progress circle
            circle {
                cx: "60",
                cy: "60",
                r: "{RADIUS}",
                stroke: "#4f46e5",
                stroke_width: "10.5",
                fill: "none",
                stroke_dasharray: "{CIRCUMFERENCE}",
                stroke_dashoffset: "{offset}",
                transform: "rotate(-90 60 60)",
                stroke_linecap: "round",
            }

            // Optional center text
            text {
                x: "60",
                y: "65",
                text_anchor: "middle",
                font_size: "18",
                fill: "#4f46e5",
                font_family: "sans-serif",
                "{(percent * 100.0).round()}%"
            }
        }
    }
}
