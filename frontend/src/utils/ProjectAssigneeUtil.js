import axios from "axios";
import _ from "lodash";
import moment from "moment";

export default class ProjectAssigneeUtil {
    static async getWorkTypeDataTable(type, category, dateStart, dateEnd) {
        // let response = await axios.get('http://jira-stats.int.robotbull.com/api/hours_per_work_type_table', {
        let response = await axios.get('http://100.120.0.9:5000/hours_per_work_type_table', {
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

    static async getProjectAssigneeDataChart(category, dateStart, dateEnd) {
        let response = await axios.get('http://100.120.0.9:5000/hours_per_project_assignee_chart', {
            params: {
                start_date: dateStart,
                end_date: dateEnd,
                // project: 'all',
                // assignee: 'all',
                category: category !== 'all' ? category : undefined,
            }
        });
        let data = response.data;
        data = this.fillEmptyPeriods(data, dateStart, dateEnd);

        let labels = [];
        data.forEach((tmp) => {
            labels = _.union(labels, Object.keys(tmp.hours));
        });
        const datasets = data.map((tmp) => ({label: tmp.type, data: Object.values(tmp.hours)}));
        return {labels, datasets};
    }

    static fillEmptyPeriods(data, dateStart, dateEnd) {
        let periodsArray = {};
        for (let start_elem = moment(dateStart); start_elem < moment(dateEnd); start_elem.add(1, "week")) {
            periodsArray[start_elem.format("WW YYYY")] = 0;
        }
        data.forEach((tmp) => {
            tmp.hours = Object.assign({}, periodsArray, tmp.hours);
        });
        return data;
    }
}