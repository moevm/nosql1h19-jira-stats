import moment from 'moment'
import axios from 'axios'

export default class WorkTypeUtils {
    static async getWorkTypeDataTable(type, category, dateStart, dateEnd) {
        let response = await axios.get('http://jira-stats.int.robotbull.com/api/hours_per_work_type_table', {
            params: {
                start_date: dateStart,
                end_date: dateEnd,
                duration: type,
                category: category !== 'all' ? category : undefined,
            }
        });
        let data = response.data;
        return this.fillEmptyPeriods(data, type, dateStart, dateEnd);
    }

    static async getWorkTypeDataChart(type, category, dateStart, dateEnd) {
        let response = await axios.get('http://jira-stats.int.robotbull.com/api/hours_per_work_type_chart', {
            params: {
                start_date: dateStart,
                end_date: dateEnd,
                duration: type,
                category: category !== 'all' ? category : undefined,
            }
        });
        let data = response.data;
        data = this.fillEmptyPeriods(data, type, dateStart, dateEnd);
        const labels = Object.keys(data[0].hours);
        const datasets = data.map((tmp) => ({label: tmp.category, data: Object.values(tmp.hours)}));
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