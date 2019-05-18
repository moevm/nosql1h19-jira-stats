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
                },
                {
                    name: 'Заказчики',
                    url: '/components',
                },
                {
                    name: 'Направления',
                    url: '/work-type',
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
