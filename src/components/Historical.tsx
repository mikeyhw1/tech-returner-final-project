import React, { useState, useEffect } from "react";
// import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";
import moment from "moment";
import { RootHistroy, Forecastday } from "./interface_weather";
import { fetchData } from "../services/httpsServices";

// import { headers } from "../API";
// import { HISTORY_URL } from "../API";

const MultiaxisHistoryWeathe: React.FC = () => {
    const [weatherData, setWeatherData] = useState<Forecastday>(); // note: named as Forecastday from API but actually history data
    const [date, setDate] = useState<String>("");
    const [dateSubtract, setDateSubtract] = useState<number>(1);
    const [labelArray, setLabelArray] = useState<number[]>([]);

    ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

    useEffect(() => {
        const dateBefore = moment().subtract(dateSubtract, "days").format("YYYY-MM-DD");
        setDate(dateBefore);
    }, [dateSubtract]);

    useEffect(() => {
        if (date) {
            const getData = async () => {
                const params = {
                    // TODO2: useContent
                    q: "London",
                    dt: date,
                    lang: "en",
                };
                const response = (await fetchData({
                    responseType: "RootHistroy",
                    params,
                })) as RootHistroy;

                // urlPath: HISTORY_URL,
                // const result = await fetchData<MyResponseType>({
                //     responseType: MyResponseType,
                //     urlPath: '/api/data',
                //     params: { id: 1 },
                //   });

                // const response = await axios.get<RootHistroy>("https://weatherapi-com.p.rapidapi.com/history.json", {
                //     headers: headers,
                //     params: {
                //         // TODO2: useContent
                //         q: "London",
                //         dt: date,
                //         lang: "en",
                //     },
                // });
                // TODO2: error handling
                createLabelArray();
                setWeatherData(response?.forecast?.forecastday[0]);
                // setWeatherData(response.data?.forecast?.forecastday[0]);
            };
            getData();
        }
    }, [date]);

    const createLabelArray = () => {
        if (dateSubtract === 0) {
            setLabelArray(createConsecutiveArray(moment().hour()));
        } else {
            setLabelArray(createConsecutiveArray(24));
        }
    };

    const createConsecutiveArray = (num: number) => {
        return Array.from({ length: num }, (_, i) => i);
    };

    const buttonsHandler = (input: -1 | 1) => {
        if (dateValidator(input)) {
            setDateSubtract(dateSubtract + input);
        } else {
            alert("Can only show pass 7 days weather data history!");
        }
    };

    const dateValidator = (input: -1 | 1) => {
        const max_dateSubtract = 7; // 7 days before
        const min_dateSubtract = 0; // today
        const adjusted_dateSubtract = dateSubtract + input;
        if (adjusted_dateSubtract >= min_dateSubtract && adjusted_dateSubtract <= max_dateSubtract) {
            return true;
        }
    };

    const data = {
        labels: labelArray,
        datasets: [
            {
                label: "Temperature (C)",
                data: weatherData?.hour?.map((data) => data.temp_c),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                yAxisID: "y",
            },
            {
                label: "Humidity (%)",
                data: weatherData?.hour?.map((data) => data.humidity),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                yAxisID: "y1",
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        stacked: false,
        scales: {
            y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
            },
            y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                grid: {
                    drawOnChartArea: false,
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Hour",
                },
            },
        },
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", maxHeight: "700px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <button style={{ marginRight: "10%", width: "10rem" }} onClick={() => buttonsHandler(1)}>
                    Prev. Day
                </button>
                <h2 style={{ textAlign: "center" }}>History Weather on {date}</h2>
                <button style={{ marginLeft: "10%", width: "10rem" }} onClick={() => buttonsHandler(-1)}>
                    Next Day
                </button>
            </div>
            <Line style={{ textAlign: "center" }} data={data} options={options} />
        </div>
    );
};

export default MultiaxisHistoryWeathe;
