import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import {fastpivot} from '../misc/fastpivot.min'

import {API_URL} from "../config";

export default class ProjectHoursUtil {
    static async getProjectHoursDataTable(dateStart, dateEnd) {
        let response = await axios.get(API_URL + 'hours_per_project_table', {
            params: {
                start_date: dateStart,
                end_date: dateEnd
            }
        });
        let data = response.data;
        let resultData = [];
        for (let start_elem = moment(dateStart); start_elem < moment(dateEnd); start_elem.add(1, "week")) {
            let week = start_elem.format("WW YYYY");
            let result = data.find(elem => elem.week === week);
            resultData.push(result || {
                deviationFromAvg: undefined,
                deviationFromMax: undefined,
                spentEstimateRatio: undefined,
                totalEstimate: undefined,
                totalSpent: undefined,
                week
            });
        }
        let result = fastpivot(resultData);
        result = {
            ...result,
            deviationFromAvg: result.deviationFromAvg.map(val => this.relativePercent(val)),
            deviationFromMax: result.deviationFromMax.map(val => this.relativePercent(val)),
            spentEstimateRatio: result.spentEstimateRatio.map(val => this.absolutePercent(val)),
            totalSpent: result.totalSpent.map(val => this.formatHours(val)),
        };
        let temp = [];
        Object.values(result).forEach((elem) => {
            let a = {};
            elem.forEach((val, i) => a[result.week[i]] = val);
            temp.push(a);
        });
        result = [
            {name: 'Трудозатраты', ...temp[4]},
            {name: 'Расход трудозатрат', ...temp[2]},
            {name: 'Отклонение от среднего', ...temp[0]},
            {name: 'Отклонение от максимального', ...temp[1]},
        ];
        return result;
    }

    static async getProjectHoursDataChart(dateStart, dateEnd) {
        let response = await axios.get(API_URL + 'hours_per_project_chart', {
            params: {
                start_date: dateStart,
                end_date: dateEnd,
            }
        });
        let data = response.data;
        let periodsArray = {};
        for (let start_elem = moment(dateStart); start_elem < moment(dateEnd); start_elem.add(1, "week")) {
            periodsArray[start_elem.format("WW YYYY")] = 0;
        }
        data.forEach((tmp) => {
            tmp.hours = Object.assign({}, periodsArray, tmp.hours);
        });
        let labels = [];
        data.forEach((tmp) => {
            labels = _.union(labels, Object.keys(tmp.hours));
        });
        const datasets = data.map((tmp) => ({label: tmp.project, data: Object.values(tmp.hours)}));
        return {labels, datasets};
    }

    static absolutePercent(num) {
        if(!num) return '-';
        return Math.round(num * 100, 0) + '%';
    }

    static relativePercent(num) {
        if(!num) return '-';
        let percent =  Math.round(num * 100, 0) - 100;
        let sign = percent > 0 ? '+' : '';
        return sign + percent + '%';
    }

    static formatHours(time) {
        if(!time) return '-';
        return Math.round(time / 3600) + "h " + time % 60 + "m";
    }
}