import moment from 'moment'
import axios from 'axios'

const data_for_chart = [
    {
        "category": "categoty",
        "hours": {
            "09 2019": 900,
            "10 2019": 5400,
            "11 2019": 9000,
            "12 2019": 7200,
            "14 2019": 27000
        },
        "project": "WORK-11"
    },
    {
        "category": "categoty",
        "hours": {
            "11 2019": 0
        },
        "project": "WORK-4"
    },
    {
        "category": "categoty",
        "hours": {
            "08 2019": 0,
            "09 2019": 1800
        },
        "project": "WORK-15"
    },
    {
        "category": "categoty",
        "hours": {
            "08 2019": 27000,
            "10 2019": 0,
            "14 2019": 900
        },
        "project": "WORK-13"
    },
    {
        "category": "categoty",
        "hours": {
            "13 2019": 14400,
            "16 2019": 0
        },
        "project": "WORK-17"
    },
    {
        "category": "categoty",
        "hours": {
            "06 2019": 18000
        },
        "project": "WORK-1"
    },
    {
        "category": "categoty",
        "hours": {
            "08 2019": 0,
            "09 2019": 16200,
            "10 2019": 3600
        },
        "project": "WORK-10"
    },
    {
        "category": "categoty",
        "hours": {
            "10 2019": 3960,
            "11 2019": 0,
            "16 2019": 10800
        },
        "project": "WORK-16"
    },
    {
        "category": "categoty",
        "hours": {
            "14 2019": 7200
        },
        "project": "WORK-7"
    },
    {
        "category": "categoty",
        "hours": {
            "06 2019": 0,
            "08 2019": 0
        },
        "project": "WORK-9"
    }
];

export default class WorkTypeUtils {
    static async getWorkTypeDataTable(type, dateStart, dateEnd) {
        let response = await axios.get('http://100.124.0.7:32137/hours_per_work_type_table', {
            params: {
                start_date: dateStart,
                end_date: dateEnd,
                duration: type,
            }
        });
        let data = response.data;
        return this.fillEmptyPeriods(data, type, dateStart, dateEnd);
    }

    static async getWorkTypeDataChart(type, dateStart, dateEnd) {
        let data = data_for_chart;
        data = this.fillEmptyPeriods(data, type, dateStart, dateEnd);
        const labels = Object.keys(data[0].hours);
        const datasets = data.map((tmp) => ({label: tmp.project, data: Object.values(tmp.hours)}));
        return {labels, datasets};
    }

    static fillEmptyPeriods(data, type, dateStart, dateEnd) {
        let periodsArray = {};
        for (let start_elem = moment(dateStart); start_elem < moment(dateEnd); start_elem.add(1, type === "week" ? "week" : "month")) {
            periodsArray[start_elem.format(type === "week" ? "WW YYYY" : "MM YYYY")] = 0;
        }
        data.forEach((tmp) => {
            tmp.hours = Object.assign({}, periodsArray, tmp.hours);
        });
        return data;
    }
}