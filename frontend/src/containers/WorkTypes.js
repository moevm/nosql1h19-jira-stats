import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import {Card, CardBody, CardHeader, FormGroup, Label, Input, Button} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import ReactTable from "react-table";
import _ from 'lodash'
import WorkTypeUtils from '../utils/WorkTypeUtils'
import 'react-table/react-table.css'
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
        callbacks: {
            label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                    label += ': ';
                }
                label += Math.round(tooltipItem.yLabel / 3600) + "h " + tooltipItem.yLabel % 60 + "m";

                return label;
            },
            titleWeek: (tooltipItems) => {
                return tooltipItems[0].xLabel + ' (' +
                    moment().day("Monday").year(tooltipItems[0].xLabel.split(' ')[1]).week(parseInt(tooltipItems[0].xLabel.split(' ')[0], 10) - 1).add(1, 'days').format("DD.MM.YYYY")
                    + ' - ' + moment().day("Monday").year(tooltipItems[0].xLabel.split(' ')[1]).week(parseInt(tooltipItems[0].xLabel.split(' ')[0], 10) - 1).add(7, 'days').format("DD.MM.YYYY") + ')';
            },
            titleMonth: (tooltipItems) => {
                return (tooltipItems[0].xLabel) + ' (' +
                    moment().day("Monday").year(tooltipItems[0].xLabel.split(' ')[1]).month(parseInt(tooltipItems[0].xLabel.split(' ')[0], 10) - 1).format("MMMM") + ')';
            }
        }
    },
    maintainAspectRatio: false,
};

const bar_options = {
    ...options,
    scales: {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
            stacked: true,
            ticks: {
                callback: (v) => Math.round(v / 3600) + "h " + v % 60 + "m",
                stepSize: 28800
            }
        }],
    }
};

const colors = [
    {
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
    }
];

export default class WorkTypes extends Component {
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
        WorkTypeUtils.getWorkTypeDataTable(
            this.state.formData.dateGroupFormat,
            this.state.formData.workType,
            this.state.formData.dateStart,
            this.state.formData.dateEnd)
            .then((data) => this.setState({
                    ...this.state,
                    tableData: data
                })
            );
        WorkTypeUtils.getWorkTypeDataChart(
            this.state.formData.dateGroupFormat,
            this.state.formData.workType,
            this.state.formData.dateStart,
            this.state.formData.dateEnd)
            .then((data) => {console.log(data); this.setState({
                ...this.state,
                labels: data.labels,
                datasets: data.datasets
            })});
    }

    componentDidMount() {
        this.updateData();
    }

    render() {
        const columns = !!this.state.tableData.length ? [
            {
                Header: 'Направление',
                accessor: 'category',
            }, {
                Header: 'Проект',
                accessor: 'project',
                Aggregated: (row) => <span>{row.value}</span>
            }, ...Object.keys(this.state.tableData[0].hours).map((week) => ({
                Header: week,
                id: week,
                accessor: (row) => row.hours[week],
                Cell: props => props.value ? Math.round(props.value / 3600) + "h " + props.value % 60 + "m" : '0h 0m',
                aggregate: vals => _.sum(vals)
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
                                    <Bar data={{
                                        labels: this.state.labels,
                                        datasets: this.state.datasets.map((dataset, i) => ({...dataset, ...colors[i]}))
                                    }} options={{
                                        ...bar_options, tooltips: {
                                            ...bar_options.tooltips,
                                            callbacks: {
                                                ...bar_options.tooltips.callbacks,
                                                title: this.state.formData.dateGroupFormat === "week" ?
                                                    bar_options.tooltips.callbacks.titleWeek :
                                                    bar_options.tooltips.callbacks.titleMonth,
                                            }
                                        }
                                    }}/>
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
                            pivotBy={['category']}
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
