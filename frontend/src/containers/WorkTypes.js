import React, {Component} from 'react';
import {Bar, Doughnut, Line, Pie, Polar, Radar} from 'react-chartjs-2';
import {Card, CardBody, CardColumns, CardHeader, FormGroup, Label, Input} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const bar = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    // datasets: [
    //     {
    //         label: 'Разработка',
    //         // backgroundColor: 'rgba(75,192,192,0.6)',
    //         // borderColor: 'rgb(75,192,192)',
    //         // borderWidth: 1,
    //         // hoverBackgroundColor: 'rgba(75,192,192,0.8)',
    //         // hoverBorderColor: 'rgba(75,192,192,1)',
    //         data: [55, 43, 17, 98, 1, 77, 42],
    //     },
    //     {
    //         label: 'Дизайн',
    //         // backgroundColor: 'rgba(255, 99, 132,0.6)',
    //         // borderColor: 'rgba(255, 99, 132,1)',
    //         // borderWidth: 1,
    //         // hoverBackgroundColor: 'rgba(255, 99, 132,0.8)',
    //         // hoverBorderColor: 'rgba(255, 99, 132,1)',
    //         data: [65, 59, 80, 81, 56, 55, 40],
    //     },
    // ],
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
                            <CardBody style={{height: 340}}>
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
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-9">
                        <Card>
                            <CardHeader>
                                График распределения трудозатрат по направлениям
                            </CardHeader>
                            <CardBody>
                                <div className="chart-wrapper" style={{height: 300}}>
                                    <Bar data={{
                                        ...bar,
                                        datasets: this.state.datasets.map((dataset, i) => {
                                            console.log({...dataset, ...colors[i]});
                                            return {...dataset, ...colors[i]}
                                        })
                                    }} options={bar_options} redraw={true}/>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        График распределения трудозатрат по направлениям
                    </CardHeader>
                    <CardBody>
                        <div className="chart-wrapper" style={{height: 300}}>
                            <Bar data={{
                                ...bar,
                                datasets: this.state.datasets.map((dataset, i) => {
                                    console.log({...dataset, ...colors[i]});
                                    return {...dataset, ...colors[i]}
                                })
                            }} options={bar_options} redraw={true}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
