import React from 'react';

const Tasks = React.lazy(() => import('./containers/Tasks'));
const WorkTypes = React.lazy(() => import('./containers/WorkTypes'));

const routes = [
    {path: '/', exact: true, name: 'JIRA Stats'},
    {path: '/tasks', name: 'Аналатика трудозатрат на задачи', component: Tasks},
    {path: '/work-type', name: 'Трудозатраты по направлению', component: WorkTypes},
];

export default routes;
