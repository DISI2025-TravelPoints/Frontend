import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import _ from "lodash";
import { DatePicker, Select, Space, TimePicker, theme } from "antd";
import { getVisitFrequencyData } from "../../requests/AdminRequests";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import "../../styles/FrequencyGraph.css";

const { RangePicker } = DatePicker;
const { Option } = Select;
const PickerWithType = ({ type, onChange }) => {
  if (type === "date") return <DatePicker onChange={onChange} />;
  return <DatePicker picker={type} onChange={onChange} />;
};

const FrequencyGraph = () => {
  const [type, setType] = useState("");
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [attractions, setAttractions] = useState([]);

  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [top, setTop] = useState("dataMax+1");
  const [bottom, setBottom] = useState("dataMin-1");
  const [animation, setAnimation] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());

const applyDateRangeFilter = (dateRange) => {
  let filteredData = rawData.filter(
    (item) => item.attraction && item.attraction.id === selectedAttraction
  );

  const aggregatedData = [];

  if (dateRange && dateRange[0] && dateRange[1]) {
    const startDate = dayjs(dateRange[0]).startOf("day");
    const endDate = dayjs(dateRange[1]).endOf("day");

    filteredData = filteredData.filter((item) => {
      const itemDate = dayjs(item.timestamp);
      return itemDate.isAfter(startDate.subtract(1, 'millisecond')) &&
             itemDate.isBefore(endDate.add(1, 'millisecond'));
    });

    const diffDays = endDate.diff(startDate, "day");

    if (diffDays <= 60) {
      const dateMap = {};
      let currentDate = startDate;

      while (currentDate.isBefore(endDate.add(1, "day"))) {
        const key = currentDate.format("YYYY-MM-DD");
        dateMap[key] = 0;
        currentDate = currentDate.add(1, "day");
      }

      filteredData.forEach((item) => {
        const key = dayjs(item.timestamp).format("YYYY-MM-DD");
        if (dateMap[key] !== undefined) {
          dateMap[key]++;
        }
      });

      Object.keys(dateMap).forEach((date) => {
        aggregatedData.push({
          label: dayjs(date).format("MMM D"),
          fullDate: date,
          visits: dateMap[date],
        });
      });
    } else if (diffDays <= 24 * 30) {
      const weekMap = {};

      filteredData.forEach((item) => {
        const itemDate = dayjs(item.timestamp);
        const weekStart = itemDate.startOf("week").format("YYYY-MM-DD");

        if (!weekMap[weekStart]) {
          weekMap[weekStart] = 0;
        }
        weekMap[weekStart]++;
      });

      Object.keys(weekMap)
        .sort()
        .forEach((weekStart) => {
          const startLabel = dayjs(weekStart).format("MMM D");
          const endLabel = dayjs(weekStart).add(6, "day").format("MMM D");

          aggregatedData.push({
            label: `${startLabel} - ${endLabel}`,
            fullDate: weekStart,
            visits: weekMap[weekStart],
          });
        });
    } else {
      const monthMap = {};

      filteredData.forEach((item) => {
        const monthKey = dayjs(item.timestamp).format("YYYY-MM");

        if (!monthMap[monthKey]) {
          monthMap[monthKey] = 0;
        }
        monthMap[monthKey]++;
      });

      Object.keys(monthMap)
        .sort()
        .forEach((monthKey) => {
          aggregatedData.push({
            label: dayjs(monthKey).format("MMM YYYY"),
            fullDate: monthKey,
            visits: monthMap[monthKey],
          });
        });
    }
  }

  setChartData(aggregatedData);
  console.log("Filtered range:", aggregatedData);
};

  const handleRangePickerChange = (dates) => {
    setDateRange(dates);
    applyDateRangeFilter(dates);
  };

  const handleDateFilterInput = (value) => {
    if (type === "month") {
      setSelectedYear(value.format("YYYY"));
      setSelectedMonth(value.format("MM"));
    } else if (type === "year") {
      setSelectedMonth(null);
      setSelectedYear(value.format("YYYY"));
    }
  };

  useEffect(() => {
    const fetchFrequencyVisits = async () => {
      try {
        let res = await getVisitFrequencyData();
        setRawData(res);
      } catch (error) {
        console.error("Error fetching visit frequency data:", error);
      }
    };
    fetchFrequencyVisits();
  }, []);

  useEffect(() => {
    const uniqueAttractions = _.uniqBy(rawData, "attraction.id").map(
      (item) => ({
        id: item.attraction.id,
        name: item.attraction.name,
      })
    );
    setAttractions(uniqueAttractions);
    if (!selectedAttraction && uniqueAttractions.length > 0) {
      setSelectedAttraction(uniqueAttractions[0].id);
    }
  }, [rawData, selectedAttraction]);
  useEffect(() => {
    if (!selectedAttraction || rawData.length === 0) {
      setChartData([]);
      return;
    }

    const getMonthName = (monthIndex) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthNames[monthIndex];
    };

    const filteredData = rawData.filter(
      (item) => item.attraction && item.attraction.id === selectedAttraction
    );

    const aggregatedData = [];

    if (selectedYear && selectedMonth && type === "month") {
      const dayVisits = new Array(31).fill(0);

      for (let i = 0; i < filteredData.length; i++) {
        const date = new Date(filteredData[i].timestamp);

        if (
          date.getFullYear() === parseInt(selectedYear) &&
          date.getMonth() + 1 === parseInt(selectedMonth)
        ) {
          const day = date.getDate();
          dayVisits[day - 1]++;
        }
      }

      for (let day = 1; day <= 31; day++) {
        aggregatedData.push({
          label: day.toString(),
          visits: dayVisits[day - 1],
        });
      }
    }

    if (selectedYear && type === "year") {
      const monthVisits = new Array(12).fill(0);

      for (let i = 0; i < filteredData.length; i++) {
        const date = new Date(filteredData[i].timestamp);

        if (date.getFullYear() === parseInt(selectedYear)) {
          const month = date.getMonth();
          monthVisits[month]++;
        }
      }

      for (let month = 0; month < 12; month++) {
        aggregatedData.push({
          label: getMonthName(month),
          visits: monthVisits[month],
        });
      }
    }
    setChartData(aggregatedData);
  }, [selectedAttraction, rawData, selectedYear, selectedMonth, type]);

  const handleAttractionChange = (value) => {
    setSelectedAttraction(value);
  };

  const handleMouseDown = (e) => {
    if (!e) return;
    setRefAreaLeft(e.activeLabel);
  };

  const handleMouseMove = (e) => {
    if (!e) return;
    refAreaLeft && setRefAreaRight(e.activeLabel);
  };

  const handleMouseUp = () => {
    if (refAreaLeft === refAreaRight || !refAreaRight) {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }

    let indexLeft = chartData.findIndex((item) => item.label === refAreaLeft);
    let indexRight = chartData.findIndex((item) => item.label === refAreaRight);

    if (indexLeft > indexRight) {
      [indexLeft, indexRight] = [indexRight, indexLeft];
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    setLeft(refAreaLeft);
    setRight(refAreaRight);

    const slicedData = chartData.slice(indexLeft, indexRight + 1);
    const visitCounts = slicedData.map((d) => d.visitCount);
    const maxValue = Math.max(...visitCounts);
    const minValue = Math.min(...visitCounts);

    setBottom(minValue > 0 ? minValue * 0.9 : 0);
    setTop(maxValue * 1.1);

    setRefAreaLeft("");
    setRefAreaRight("");
  };

  return (
    <div className="graph-container">
      <div className="graph-container-title">
        <h2>Visit Frequency</h2>
      </div>
      <div style={{ height: "500px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              domain={[left, right]}
              type="category"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              domain={[bottom, top]}
              type="number"
              name="Visits"
              label={{
                value: "Number of Visits",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#4CAF50"
              name="Visit Count"
              dot={{ r: 3 }}
              activeDot={{ r: 8 }}
              isAnimationActive={animation}
            />

            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="#4CAF50"
                fillOpacity={0.3}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="actions-container">
        <div className="controls-row">
          <select
            className="attraction-select"
            value={selectedAttraction || ""}
            onChange={(e) => handleAttractionChange(e.target.value)}
          >
            <option value="" disabled>
              Select an attraction
            </option>
            {attractions.map((attraction) => (
              <option key={attraction.id} value={attraction.id}>
                {attraction.name}
              </option>
            ))}
          </select>

          <div className="date-controls">
            <Space>
              <Select
                aria-label="Picker Type"
                value={type}
                onChange={setType}
                style={{ width: 150 }}
              >
                <Option value="" disabled>
                  Select filter
                </Option>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
              </Select>
              <PickerWithType
                type={type}
                onChange={(value) => {
                  handleDateFilterInput(value);
                }}
              />
            </Space>

            <div className="vertical-stack">
              <RangePicker onChange={handleRangePickerChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyGraph;
