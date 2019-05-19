import React from 'react';

const Tasks = React.lazy(() => import('./containers/Tasks'));
const Components = React.lazy(() => import('./containers/Components'));
const WorkTypes = React.lazy(() => import('./containers/WorkTypes'));
const Config = React.lazy(() => import('./containers/Config'));

const routes = [
    {path: '/', exact: true, name: 'JIRA Stats'},
    {path: '/tasks', name: 'Аналатика трудозатрат на задачи', component: Tasks},
    {path: '/components', name: 'Тенденция трудозатрат по заказчикам', component: Components},
    {path: '/work-type', name: 'Трудозатраты по направлению', component: WorkTypes},
    {path: '/config', name: 'Конфигурация', component: Config},

];

export default routes;
