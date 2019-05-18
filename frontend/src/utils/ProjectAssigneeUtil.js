import axios from "axios";
import _ from "lodash";
import moment from "moment";

import {API_URL} from "../config";

export default class ProjectAssigneeUtil {
    static async getProjectAssigneeDataTable(category, dateStart, dateEnd) {
        let response = await axios.get(API_URL + 'hours_per_project_assignee_table', {
            params: {
                start_date: dateStart,
                end_date: dateEnd,
                // project: 'all',
                // assignee: 'all',
                category: category !== 'all' ? category : undefined,
            }
        });
        let data = response.data;
        return this.fillEmptyPeriods(data, dateStart, dateEnd);
    }

    static async getProjectAssigneeDataChart(category, dateStart, dateEnd) {
        let response = await axios.get(API_URL + 'hours_per_project_assignee_chart', {
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