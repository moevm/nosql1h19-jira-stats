# -*- coding: utf-8 -*-

from app.create_app import db

from datetime import datetime, timedelta


class Issue:

    def __init__(
            self,
            key='',
            created='',
            assignee='',
            resolutiondate='',
            timeestimate='',
            status='',
            component='',
            project='',
            category=''):
        self.key = key
        self.created = created,
        self.assignee = assignee,
        self.resolutiondate = resolutiondate,
        self.timeestimate = timeestimate,
        self.status = status,
        self.component = component
        self.project = project
        self.category = category

    def save(self):
        db.issue.insert_one({'key': self.key,
                             'created': self.created,
                             'assignee': self.assignee,
                             'resolutiondate': self.resolutiondate,
                             'timeestimate': self.timeestimate,
                             'status': self.status,
                             'component': self.component,
                             'project': self.project,
                             'category': self.category})

    def find_by_component(self):
        return db.issue.find({'component': self.component})

    @staticmethod
    def hours_per_work_type_table(start_datetime=datetime.now().isoformat(),
                                  end_datetime=(datetime.now() + timedelta(days=30)).isoformat(),
                                  duration='month'):
        """
        Трудозатраты по воркам для таблицы

        Args:
            start_datetime (str): Дата начала в формате гггг-мм-дд
            end_datetime (str): Дата окончания в формате гггг-мм-дд
            duration (str): Продолжительность: month или week

        Returns:
              list
        """

        query = list()

        query.append({
            '$match':
                {
                    'created': {
                        '$gte': start_datetime,
                        '$lt': end_datetime
                    }
                }
        })

        query.append({
            '$group': {
                '_id': {
                    'category': "$category",
                    'project': "$project",
                },
                'total': {
                    '$sum': {
                        '$arrayElemAt': ["$timeestimate", 0]
                    }
                }
            }
        })

        if duration == 'month':
            query[1]['$group']['_id'].update({'month': {
                '$dateToString': {
                    'date': {
                        '$arrayElemAt': ["$created", 0]
                    },
                    'format': "%m %Y"
                }
            }})
        else:
            query[1]['$group']['_id'].update({'week': {
                '$dateToString': {
                    'date': {
                        '$arrayElemAt': ["$created", 0]
                    },
                    'format': "%U %Y"
                }
            }})

        query.append({
            '$group': {
                '_id': {
                    'category': "$_id.category",
                    'project': "$_id.project"
                },
                'hours': {
                    '$push': {
                        # если неделя
                        'k': "$_id.week",
                        # если месяц
                        'k': "$_id.month",
                        'v': "$total"
                    }
                }
            }
        })

        if duration == 'week':
            query[2]['$group']['hours']['$push'].update({'k': "$_id.week"})
        else:
            query[2]['$group']['hours']['$push'].update({'k': "$_id.month",
                                                         'v': "$total"})

        query.append({
            '$addFields': {
                'hours': {
                    '$arrayToObject': "$hours"
                }
            }
        })

        query.append({
            '$project': {
                'category': "$_id.category",
                'project': "$_id.project",
                'hours': 1,
                '_id': 0
            }
        })

        return list(db.issue.aggregate(query))


class User:

    def __init__(
            self,
            login='',
            avatar_url='',
            full_name=''):
        self.__login = login
        self.__avatar_url = avatar_url
        self.__full_name = full_name