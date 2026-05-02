function getChartInstance(el, currentChart) {
    if (!el || !window.echarts) return null;
    return currentChart ?? window.echarts.getInstanceByDom(el) ?? window.echarts.init(el);
}

function toDate(value) {
    if (!value) return null;
    const date = value.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey) {
    const [, month, day] = dateKey.split("-");
    return `${Number(month)}/${Number(day)}`;
}

function emptyGraphic(hasData) {
    if (hasData) return [];

    return [{
        type: "text",
        left: "center",
        top: "middle",
        style: {
            text: "目前沒有案件資料",
            fill: "#8b8993",
            fontSize: 14,
            fontWeight: 700
        }
    }];
}

export function renderDeptChart(el, cases, DEPT_META, currentChart = null) {
    const chart = getChartInstance(el, currentChart);
    if (!chart) return null;

    const deptKeys = Object.keys(DEPT_META);
    const counts = Object.fromEntries(deptKeys.map(dept => [dept, 0]));

    cases.forEach(item => {
        item.transferDepartments?.forEach(dept => {
            counts[dept] = (counts[dept] ?? 0) + 1;
        });
    });

    const sortedDepts = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const data = sortedDepts.map(dept => ({
        name: DEPT_META[dept]?.short ?? dept,
        value: counts[dept],
        itemStyle: {
            color: DEPT_META[dept]?.color ?? "#8b8993"
        }
    }));
    const hasData = data.some(item => item.value > 0);

    chart.setOption({
        aria: {
            enabled: true
        },
        color: sortedDepts.map(dept => DEPT_META[dept]?.color ?? "#8b8993"),
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            top: 22,
            right: 14,
            bottom: 30,
            left: 38
        },
        xAxis: {
            type: "category",
            data: data.map(item => item.name),
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: "#d9d2ca"
                }
            },
            axisLabel: {
                color: "#6f7079",
                fontWeight: 700
            }
        },
        yAxis: {
            type: "value",
            minInterval: 1,
            splitLine: {
                lineStyle: {
                    color: "#eee8e2"
                }
            },
            axisLabel: {
                color: "#8b8993"
            }
        },
        series: [{
            name: "案件量",
            type: "bar",
            data,
            barMaxWidth: 34,
            itemStyle: {
                borderRadius: [8, 8, 0, 0]
            }
        }],
        graphic: emptyGraphic(hasData)
    }, true);

    return chart;
}

export function renderDailyCaseChart(el, cases, currentChart = null) {
    const chart = getChartInstance(el, currentChart);
    if (!chart) return null;

    const counts = {};

    cases.forEach(item => {
        const date = toDate(item.createdAt);
        if (!date) return;
        const dateKey = toDateKey(date);
        counts[dateKey] = (counts[dateKey] ?? 0) + 1;
    });

    const sortedDateKeys = Object.keys(counts).sort();
    const values = sortedDateKeys.map(dateKey => counts[dateKey]);
    const hasData = values.length > 0;

    chart.setOption({
        aria: {
            enabled: true
        },
        color: ["#5d89db"],
        tooltip: {
            trigger: "axis"
        },
        grid: {
            top: 24,
            right: 18,
            bottom: 30,
            left: 38
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: sortedDateKeys.map(formatDateLabel),
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: "#d9d2ca"
                }
            },
            axisLabel: {
                color: "#6f7079",
                fontWeight: 700
            }
        },
        yAxis: {
            type: "value",
            minInterval: 1,
            splitLine: {
                lineStyle: {
                    color: "#eee8e2"
                }
            },
            axisLabel: {
                color: "#8b8993"
            }
        },
        series: [{
            name: "新增案件",
            type: "line",
            smooth: true,
            symbolSize: 8,
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: "rgba(93, 137, 219, 0.28)" },
                        { offset: 1, color: "rgba(93, 137, 219, 0.02)" }
                    ]
                }
            },
            lineStyle: {
                width: 3
            },
            data: values
        }],
        graphic: emptyGraphic(hasData)
    }, true);

    return chart;
}

export function resizeCharts(charts) {
    charts.forEach(chart => chart?.resize());
}
