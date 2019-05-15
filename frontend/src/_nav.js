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
                    attributes: { disabled: true },
                },
                {
                    name: 'Проекты',
                    //url: '/base',
                   // icon: 'fa fa-project-diagram',
                    attributes: { disabled: true },
                },
                {
                    name: 'Направления',
                    url: '/work-type',
                   // icon: 'fa fa-project-diagram',
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
