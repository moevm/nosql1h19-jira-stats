import React, {Component} from 'react';
import {Bar, Doughnut, Line, Pie, Polar, Radar} from 'react-chartjs-2';
import {Card, CardBody, CardColumns, CardHeader} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const bar = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Разработка',
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgb(75,192,192)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.8)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: [55, 43, 17, 98, 1, 77, 42],
        },
        {
            label: 'Дизайн',
            backgroundColor: 'rgba(255, 99, 132,0.6)',
            borderColor: 'rgba(255, 99, 132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 99, 132,0.8)',
            hoverBorderColor: 'rgba(255, 99, 132,1)',
            data: [65, 59, 80, 81, 56, 55, 40],
        },
    ],
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

export default class WorkTypes extends Component {
    render() {
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        График распределения трудозатрат по направлениям
                    </CardHeader>
                    <CardBody>
                        <div className="chart-wrapper" style={{height: 300}}>
                            <Bar data={bar} options={bar_options}/>
                        </div>
                    </CardBody>
                </Card>
                <CardColumns className="cols-2">

                </CardColumns>
            </div>
        );
    }
}
