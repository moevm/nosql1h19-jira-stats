import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {Card, CardBody, CardHeader, FormGroup, Label, Input, Button} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import ReactTable from "react-table";
import _ from 'lodash'
import 'react-table/react-table.css'
import ProjectAssigneeUtil from '../utils/ProjectAssigneeUtil'
import moment from "moment"

import 'moment/locale/ru';

moment.lang('ru', {
    week: {
        dow: 1
    }
});
moment.locale('ru');


const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips,
        mode: 'index',
        callbacks: {
            label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                    label += ': ';
                }
                label += Math.round(tooltipItem.yLabel / 3600) + "h " + Math.round(tooltipItem.yLabel % 60) + "m";

                return label;
            },
            title: (tooltipItems) => {
                return tooltipItems[0].xLabel + ' (' +
                    moment().day("Monday").year(tooltipItems[0].xLabel.split(' ')[1]).week(parseInt(tooltipItems[0].xLabel.split(' ')[0], 10) - 1).add(1, 'days').format("DD.MM.YYYY")
                    + ' - ' + moment().day("Monday").year(tooltipItems[0].xLabel.split(' ')[1]).week(parseInt(tooltipItems[0].xLabel.split(' ')[0], 10) - 1).add(7, 'days').format("DD.MM.YYYY") + ')';
            },
        }
    },
    maintainAspectRatio: false,
};

const line_options = {
    ...options,
    scales: {
        yAxes: [{
            ticks: {
                callback: (v) => Math.round(v / 3600) + "h " + v % 60 + "m",
                stepSize: 36000
            }
        }],
    }
};

const colors = [
    {
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        //fill: false,
    }, {
        backgroundColor: 'rgba(74, 74, 74, 0.8)',
        borderColor: 'rgb(74, 74, 74)',
        borderWidth: 1,
        //fill: false,
    }
];

export default class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            datasets: [],
            tableData: [],
            formData: {
                dateStart: moment().subtract(3, "month").format('YYYY-MM-DD'),
                dateEnd: moment().format('YYYY-MM-DD'),
                dateGroupFormat: 'month',
                workType: 'all',
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        this.setState({
            ...this.state, formData: {
                ...this.state.formData,
                [target.name]: target.value
            }
        });
    }

    updateData() {
        ProjectAssigneeUtil.getProjectAssigneeDataTable(
            this.state.formData.workType,
            this.state.formData.dateStart,
            this.state.formData.dateEnd)
            .then((data) => {
                    this.setState({
                        ...this.state,
                        tableData: data
                    });
                    console.log(data);
                }
            );
        ProjectAssigneeUtil.getProjectAssigneeDataChart(
            this.state.formData.workType,
            this.state.formData.dateStart,
            this.state.formData.dateEnd)
            .then((data) =>
                this.setState({
                    ...this.state,
                    labels: data.labels,
                    datasets: data.datasets
                })
            );
    }

    componentDidMount() {
        this.updateData();
    }

    render() {
        const columns = !!this.state.tableData.length ? [
            {
                Header: 'Проект',
                accessor: 'project',
            }, {
                Header: 'Исполнитель',
                accessor: 'assignee',
                Aggregated: (row) => <span>{row.value}</span>
            }, {
                Header: 'Тип оценки',
                accessor: 'type',
                Aggregated: (row) => <span></span>
            }, ...Object.keys(this.state.tableData[0].hours).map((week) => ({
                Header: week,
                id: week,
                accessor: (row) => {console.log(row); return row.hours[week]},
                Cell: props => props.value ? Math.round(props.value / 3600) + "h " + props.value % 60 + "m" : ' ',
                aggregate: vals => vals[0]
            }))] : [];
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-3">
                        <Card>
                            <CardHeader>
                                Параметры
                            </CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Label htmlFor="date_start">Начало периода</Label>
                                    <Input name="dateStart" type="date" value={this.state.formData.dateStart}
                                           onChange={this.handleInputChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="date_start">Конец периода</Label>
                                    <Input name="dateEnd" type="date" value={this.state.formData.dateEnd}
                                           onChange={this.handleInputChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="dateGroupFormat">Формат</Label>
                                    <Input type="select" name="dateGroupFormat"
                                           value={this.state.formData.dateGroupFormat}
                                           onChange={this.handleInputChange}>
                                        <option value="month">Месяц</option>
                                        <option value="week">Неделя</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="workType">Направление</Label>
                                    <Input type="select" name="workType" value={this.state.formData.workType}
                                           onChange={this.handleInputChange}>
                                        <option value="all">Все</option>
                                        <option value="Разработка">Разработка</option>
                                        <option value="Дизайн">Дизайн</option>
                                        <option value="Администрирование">Администрирование</option>
                                    </Input>
                                </FormGroup>
                                <div className="form-actions">
                                    <Button color="primary" style={{width: '100%'}}
                                            onClick={this.updateData}>Обновить</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-9">
                        <Card>
                            <CardHeader>
                                График распределения трудозатрат по направлениям
                            </CardHeader>
                            <CardBody>
                                <div className="chart-wrapper" style={{height: 355}}>
                                    <Line data={{
                                        labels: this.state.labels,
                                        datasets: this.state.datasets.map((dataset, i) => ({...dataset, ...colors[i]}))
                                    }} options={line_options
                                        // ...bar_options, tooltips: {
                                        //     ...bar_options.tooltips,
                                        //     callbacks: {
                                        //         ...bar_options.tooltips.callbacks,
                                        //         title: this.state.formData.dateGroupFormat === "week" ?
                                        //             bar_options.tooltips.callbacks.titleWeek :
                                        //             bar_options.tooltips.callbacks.titleMonth,
                                        //     }
                                        // }
                                    }/>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        Распределение трудозатрат по направлениям
                    </CardHeader>
                    <CardBody>
                        {!!this.state.tableData.length && <ReactTable
                            data={this.state.tableData}
                            pivotBy={['project', 'assignee']}
                            columns={columns}
                            className="-highlight -striped"
                            showPagination={false}
                            minRows={0}
                        />}
                    </CardBody>
                </Card>
            </div>
        );
    }
}
