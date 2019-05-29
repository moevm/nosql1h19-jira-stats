import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import {Card, CardBody, CardHeader, FormGroup, Label, Input, Button} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import ReactTable from "react-table";
import _ from 'lodash'
import ProjectHoursUtil from '../utils/ProjectHoursUtil'
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
            title: (tooltipItems) => {
                return tooltipItems[0].xLabel + ' (' +
                    moment().day("Monday").year(tooltipItems[0].xLabel.split(' ')[1]).week(parseInt(tooltipItems[0].xLabel.split(' ')[0], 10) - 1).add(1, 'days').format("DD.MM.YYYY")
                    + ' - ' + moment().day("Monday").year(tooltipItems[0].xLabel.split(' ')[1]).week(parseInt(tooltipItems[0].xLabel.split(' ')[0], 10) - 1).add(7, 'days').format("DD.MM.YYYY") + ')';
            },
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
        backgroundColor: 'rgba(155, 89, 182,1.0)',
        borderColor: 'rgba(155, 89, 182,0.8)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(32,168,216,1.0)',
        borderColor: 'rgba(32,168,216,0.8)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(230, 126, 34,1.0)',
        borderColor: 'rgba(230, 126, 34,0.8)',
        borderWidth: 1,
    }, {
        backgroundColor: 'rgba(46, 204, 113,1.0)',
        borderColor: 'rgba(46, 204, 113,0.8)',
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
                dateStart: moment().subtract(2, "month").format('YYYY-MM-DD'),
                dateEnd: moment().format('YYYY-MM-DD'),
                component: 'all',
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
        ProjectHoursUtil.getProjectHoursDataTable(
            this.state.formData.dateStart,
            this.state.formData.dateEnd,
            this.state.formData.component)
            .then((data) => this.setState({
                    ...this.state,
                    tableData: data
                })
            );
        ProjectHoursUtil.getProjectHoursDataChart(
            this.state.formData.dateStart,
            this.state.formData.dateEnd,
            this.state.formData.component)
            .then((data) =>
                this.setState({
                    ...this.state,
                    labels: data.labels,
                    datasets: data.datasets
                }));
    }

    componentDidMount() {
        this.updateData();
    }

    render() {
        let columns = [];
        if (!!this.state.tableData.length) {
            let cols = {...this.state.tableData[0]};
            delete cols['name'];
            columns = [
                {
                    Header: 'Тип оценки',
                    accessor: 'name',
                }, ...Object.keys(cols).map((week, i) => ({
                    Header: week,
                    id: week,
                    accessor: (row) => row[week],
                }))];
        }
        console.log(this.state);
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
                                    <Label htmlFor="component">Заказчик</Label>
                                    <Input type="select" name="component"
                                           value={this.state.formData.component}
                                           onChange={this.handleInputChange}>
                                        <option value="all">Все</option>
                                        <option value="ESS">ESS</option>
                                        <option value="FinTech">FinTech</option>
                                        <option value="PlanSharing">PlanSharing</option>
                                        <option value="RobotBull">RobotBull</option>
                                        <option value="Rusintermo">Rusintermo</option>
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
                                <div className="chart-wrapper" style={{height: 275}}>
                                    <Bar data={{
                                        labels: this.state.labels,
                                        datasets: this.state.datasets.map((dataset, i) => ({...dataset, ...colors[i]}))
                                    }} options={bar_options}/>
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
                            columns={columns}
                            className="-highlight -striped"
                            showPagination={false}
                            minRows={0}
                        />}
                    </CardBody>
                </Card>
            </div>
        )
            ;
    }
}
