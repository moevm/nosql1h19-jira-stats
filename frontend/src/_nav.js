export default {
    items: [
        {
            name: 'Аналитика',
            //url: '/base',
            icon: 'icon-chart',
            children: [
                {
                    name: 'Задачи',
                    url: '/tasks',
                    //icon: 'fa fa-tasks',
                },
                {
                    name: 'Проекты',
                    //url: '/base',
                   // icon: 'fa fa-project-diagram',
                },
                {
                    name: 'Направления',
                    //url: '/base',
                   // icon: 'fa fa-project-diagram',
                    attributes: { disabled: true },
                },
            ],
        },
        {
            name: 'Конфигурация',
            url: '/config',
            icon: 'icon-settings',
        },
    ],
};
