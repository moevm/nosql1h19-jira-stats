import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import {Card, CardBody, CardHeader, FormGroup, Label, Input, Button} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import ReactTable from "react-table";
import _ from 'lodash'
import 'react-table/react-table.css'

const data = [
    {
        workType: 'Разработка', work: 'WORK-1', hours: {
            '01 2019': 10,
            '02 2019': 20,
            '03 2019': 10,
            '04 2019': 10,
            '05 2019': 10,
            '06 2019': 10,
            '07 2019': 10,
            '08 2019': 10,
        }
    },
    {
        workType: 'Разработка', work: 'WORK-2', hours: {
            '01 2019': 11,
            '02 2019': 21,
            '03 2019': 11,
        }
    }
];

const columns = [
    {
        Header: 'Направление',
        accessor: 'workType',
    }, {
        Header: 'Проект',
        accessor: 'work',
        Aggregated: (row) => <span>{row.value}</span>
    }, ...Object.keys(data[0].hours).map((week) => ({
        Header: week,
        id: week,
        accessor: (row) => row.hours[week],
        aggregate: vals => _.sum(vals)
    }))];

const bar = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
};

const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false
};

const bar_options = {
    ...options,
    scales: {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
            stacked: true
        }]
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
            datasets: []
        };
        setTimeout(() => this.setState({
            datasets: [
                {
                    label: 'Разработка',
                    data: [55, 43, 17, 98, 1, 77, 45],
                },
                {
                    label: 'Дизайн',
                    data:
                        [65, 59, 80, 81, 56, 55, 40],
                }]
        }), 500);
    }

    render() {
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
                                    <Input name="date_start" type="date"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="date_start">Конец периода</Label>
                                    <Input name="date_end" type="date"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="dateGroupFormat">Формат</Label>
                                    <Input type="select" name="dateGroupFormat">
                                        <option value="month">Месяц</option>
                                        <option value="week">Неделя</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="workType">Направление</Label>
                                    <Input type="select" name="workType">
                                        <option value="all">Все</option>
                                        <option value="development">Разработка</option>
                                        <option value="design">Дизайн</option>
                                    </Input>
                                </FormGroup>
                                <div className="form-actions">
                                    <Button type="submit" color="primary" style={{width: '100%'}}>Обновить</Button>
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
                                        ...bar,
                                        datasets: this.state.datasets.map((dataset, i) => ({...dataset, ...colors[i]}))
                                    }} options={bar_options} redraw={true}/>
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
                        <ReactTable
                            data={data}
                            pivotBy={['workType']}
                            columns={columns}
                            className="-highlight -striped"
                            showPagination={false}
                            minRows={0}
                        />
                    </CardBody>
                </Card>
            </div>
        );
    }
}
