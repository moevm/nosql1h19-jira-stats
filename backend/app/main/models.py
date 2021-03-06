# -*- coding: utf-8 -*-

from datetime import datetime, timedelta

from app.create_app import db

from bson.json_util import dumps, loads


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
    def export_documents_to_json():
        """
        Экспорт документов коллекции в JSON

        Returns:
             str - JSON-строка
        """
        cursor = db.issue.find({})
        docs = list()

        for document in cursor:
            docs.append(document)

        return dumps(docs)

    @staticmethod
    def import_documents_from_json(json_string):
        """
        Импорт документов коллекции из JSON

        Args:
            json_string (str): JSON-строка с документами

        """
        db.issue.drop()
        docs = loads(json_string)
        for document in docs:
            db.issue.insert_one(document)

    @staticmethod
    def hours_per_work_type_table(start_datetime=datetime.now().isoformat(),
                                  end_datetime=(datetime.now() + timedelta(days=30)).isoformat(),
                                  duration='month', category="all"):
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
                    'resolutiondate': {
                        '$gte': start_datetime,
                        '$lt': end_datetime
                    },
                    # "resolutiondate": {'$ne': None}
                }
        })

        if category:
            query[0]['$match'].update({'category': category})

        query.append({
            '$group': {
                '_id': {
                    'category': "$category",
                    'project': "$project",
                },
                'total': {
                    '$sum': "$timespent"
                }
            }
        })

        if duration == 'month':
            query[1]['$group']['_id'].update({'month': {
                '$dateToString': {
                    'date': "$resolutiondate",
                    'format': "%m %Y"
                }
            }})
        else:
            query[1]['$group']['_id'].update({'week': {
                '$dateToString': {
                    'date': "$resolutiondate",
                    'format': "%V %Y"
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
                    }
                }
            }
        })

        if duration == 'week':
            query[2]['$group']['hours']['$push'].update({'k': "$_id.week", 'v': "$total"})
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

    @staticmethod
    def hours_per_work_type_chart(start_datetime=datetime.now().isoformat(),
                                  end_datetime=(datetime.now() + timedelta(days=30)).isoformat(),
                                  duration='month', category="all"):
        """
        Трудозатраты по воркам для графика

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
                    'resolutiondate': {
                        '$gte': start_datetime,
                        '$lt': end_datetime
                    },
                    # "resolutiondate": {'$ne': None}
                }
        })

        if category:
            query[0]['$match'].update({'category': category})

        query.append({
            '$group': {
                '_id': {
                    'category': "$category"
                },
                'total': {
                    '$sum': "$timespent"
                }
            }
        })

        if duration == 'month':
            query[1]['$group']['_id'].update({'month': {
                '$dateToString': {
                    'date': "$resolutiondate",
                    'format': "%m %Y"
                }
            }})
        else:
            query[1]['$group']['_id'].update({'week': {
                '$dateToString': {
                    'date': "$resolutiondate",
                    'format': "%V %Y"
                }
            }})

        query.append({
            '$group': {
                '_id': {
                    'category': "$_id.category"
                },
                'hours': {
                    '$push': {
                    }
                }
            }
        })

        if duration == 'week':
            query[2]['$group']['hours']['$push'].update({'k': "$_id.week", 'v': "$total"})
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
                'hours': 1,
                '_id': 0
            }
        })

        return list(db.issue.aggregate(query))

    @staticmethod
    def hours_per_project_assignee_chart(start_datetime=datetime.now().isoformat(),
                                         end_datetime=(datetime.now() + timedelta(days=30)).isoformat(),
                                         assignee=None, category=None, project=None):
        """
        Трудозатраты по исполнителям для графика

        Args:
            start_datetime (str): Дата начала в формате гггг-мм-дд
            end_datetime (str): Дата окончания в формате гггг-мм-дд
            assignee (str): Исполнитель (ник в Jira)
            category (str): Категория
            project (str): Название проекта

        Returns:
            list
         """
        query = list()
        query.append({
            "$match": {
                "resolutiondate": {
                    "$gte": start_datetime,
                    "$lt": end_datetime
                }
            }
        })
        if category:
            query[0]["$match"].update({"category": category})
        if assignee:
            query[0]["$match"].update({"assignee": assignee})
        if project:
            query[0]["$match"].update({"project": project})
        query.append({
            "$group": {
                "_id": {
                    "week": {
                        "$dateToString": {
                            "date": "$resolutiondate",
                            "format": "%V %Y"
                        }
                    }
                },
                "totalSpent": {
                    "$sum": "$timespent"
                },
                "totalExpect": {
                    "$sum": "$timeoriginalestimate"
                }
            }
        })
        query.append({
            "$group": {
                "_id": {},
                "hoursSpent": {
                    "$push": {
                        "k": "$_id.week",
                        "v": "$totalSpent"
                    }
                },
                "hoursExpect": {
                    "$push": {
                        "k": "$_id.week",
                        "v": "$totalExpect"
                    }
                }
            }
        })
        query.append({
            "$addFields": {
                "hoursSpent": {
                    "$arrayToObject": "$hoursSpent"
                },
                "hoursExpect": {
                    "$arrayToObject": "$hoursExpect"
                }
            }
        })
        query.append({
            "$project": {
                "hours": [{
                    "type": "Фактические",
                    "hours": "$hoursSpent"
                }, {
                    "type": "Оценочные",
                    "hours": "$hoursExpect"
                }],
                "_id": 0
            }
        })
        query.append({
            "$unwind": "$hours"
        })
        query.append({
            "$project": {
                "type": "$hours.type",
                "hours": "$hours.hours"
            }
        })
        return list(db.issue.aggregate(query))

    @staticmethod
    def hours_per_project_assignee_table(start_datetime=datetime.now().isoformat(),
                                         end_datetime=(datetime.now() + timedelta(days=30)).isoformat(),
                                         assignee=None, category=None, project=None):
        """
        Трудозатраты по исполнителям для таблицы

        Args:
            start_datetime (str): Дата начала в формате гггг-мм-дд
            end_datetime (str): Дата окончания в формате гггг-мм-дд
            assignee (str): Исполнитель (ник в Jira)
            category (str): Категория
            project (str): Название проекта

        Returns:
            list
         """
        query = list()
        query.append({
            "$match": {
                "resolutiondate": {
                    "$gte": start_datetime,
                    "$lt": end_datetime
                }
            }
        })
        if category:
            query[0]["$match"].update({"category": category})
        if assignee:
            query[0]["$match"].update({"assignee": assignee})
        if project:
            query[0]["$match"].update({"project": project})

        query.append({
            "$group": {
                "_id": {
                    "project": "$project",
                    "assignee": "$assignee",
                    "week": {
                        "$dateToString": {
                            "date": "$resolutiondate",
                            "format": "%V %Y"
                        }
                    }
                },
                "totalSpent": {
                    "$sum": "$timespent"
                },
                "totalExpect": {
                    "$sum": "$timeoriginalestimate"
                }
            }
        })

        query.append({
            "$group": {
                "_id": {
                    "project": "$_id.project",
                    "assignee": "$_id.assignee",
                },
                "hoursSpent": {
                    "$push": {
                        "k": "$_id.week",
                        "v": "$totalSpent"
                    }
                },
                "hoursExpect": {
                    "$push": {
                        "k": "$_id.week",
                        "v": "$totalExpect"
                    }
                }
            }
        })

        query.append({
            "$addFields": {
                "hoursSpent": {
                    "$arrayToObject": "$hoursSpent"
                },
                "hoursExpect": {
                    "$arrayToObject": "$hoursExpect"
                }
            }
        })

        query.append({
            "$project": {
                "project": "$_id.project",
                "assignee": "$_id.assignee",
                "hours": [{
                    "type": "Фактические",
                    "hours": "$hoursSpent"
                }, {
                    "type": "Оценочные",
                    "hours": "$hoursExpect"
                }],
                "_id": 0
            }
        })

        query.append({
            "$unwind": "$hours"
        })

        query.append({
            "$project": {
                "project": "$project",
                "assignee": "$assignee",
                "type": "$hours.type",
                "hours": "$hours.hours"
            }
        })

        return list(db.issue.aggregate(query))

    @staticmethod
    def hours_per_project_table(start_datetime=datetime.now().isoformat(),
                                end_datetime=(datetime.now() + timedelta(days=30)).isoformat(), component=None):
        """
        Трудозатраты по проектам для таблицы

        Args:
            start_datetime (str): Дата начала в формате гггг-мм-дд
            end_datetime (str): Дата окончания в формате гггг-мм-дд
            component (str): Заказчие

        Returns:
            list
        """
        query = list()
        query.append({
            "$match": {
                "resolutiondate": {
                    "$gte": start_datetime,
                    "$lt": end_datetime
                },
            }
        })

        if component:
            query[0]["$match"].update({"component": component})

        query.append(
            {
                "$group": {
                    "_id": {
                        "week": {
                            "$dateToString": {
                                "date": "$resolutiondate",
                                "format": "%V %Y"
                            }
                        }
                    },
                    "totalEstimate": {
                        "$sum": "$timeoriginalestimate"
                    },
                    "totalSpent": {
                        "$sum": "$timespent"
                    },

                }
            })
        query.append(
            {
                "$facet": {
                    "statTotalSpent": [
                        {
                            "$group": {
                                "_id": {},
                                "avgTotalSpent": {
                                    "$avg": "$totalSpent"
                                },
                                "maxTotalSpent": {
                                    "$max": "$totalSpent"
                                },

                            }
                        }
                    ],
                    "hoursPerWeek": [
                        {
                            "$project": {
                                "week": "$_id.week",
                                "totalEstimate": "$totalEstimate",
                                "totalSpent": "$totalSpent",
                                "_id": 0
                            }
                        }
                    ],

                }
            })
        query.append({
            "$project": {
                "statTotalSpent": {
                    "$arrayElemAt": ["$statTotalSpent", 0]
                },
                "hoursPerWeek": "$hoursPerWeek"
            }
        })
        query.append({
            "$project": {
                "statTotalSpent": "$statTotalSpent",
                "hoursPerWeek": {
                    "$map": {
                        "input": "$hoursPerWeek",
                        "as": "temp",
                        "in": {
                            "$mergeObjects": [
                                "$$temp",
                                 {
                                    "spentEstimateRatio": {
                                        "$divide": ["$$temp.totalSpent", "$$temp.totalEstimate"]
                                    },
                                    "deviationFromAvg": {
                                        "$divide": ["$$temp.totalSpent", "$statTotalSpent.avgTotalSpent"]
                                    },
                                    "deviationFromMax": {
                                        "$divide": ["$$temp.totalSpent", "$statTotalSpent.maxTotalSpent"]
                                    },

                                    }
                                ]
                            }
                        }
                    }
                }
            })
        query.append({
            "$project": {
               "hoursPerWeek": "$hoursPerWeek"
            }
        })
        query.append({
            "$unwind": "$hoursPerWeek"
        })
        query.append({
            "$replaceRoot": {
                "newRoot": "$hoursPerWeek"
            }
        })

        return list(db.issue.aggregate(query))

    @staticmethod
    def hours_per_project_chart(start_datetime=datetime.now().isoformat(),
                                end_datetime=(datetime.now() + timedelta(days=30)).isoformat(), component=None):
        """
        Трудозатраты по проектам для графика

        Args:
            start_datetime (str): Дата начала в формате гггг-мм-дд
            end_datetime (str): Дата окончания в формате гггг-мм-дд
            component (str): Заказчик

        Returns:
            list
        """
        query = list()

        query.append({
            "$match": {
                "resolutiondate": {
                    "$gte": start_datetime,
                    "$lt": end_datetime
                },
            }
        })

        if component:
            query[0]["$match"].update({"component": component})

        query.append(
            {
                "$group": {
                    "_id": {
                        "project": "$component",
                        "week": {
                            "$dateToString": {
                                "date": "$resolutiondate",
                                "format": "%V %Y"
                            }
                        }
                    },
                    "totalSpent": {
                        "$sum": "$timespent"
                    },
                    "totalExpect": {
                        "$sum": "$timeoriginalestimate"
                    }
                }
            })
        query.append(
            {
                "$group": {
                    "_id": {
                        "project": "$_id.project",
                    },
                    "hours": {
                        "$push": {
                            "k": "$_id.week",
                            "v": "$totalSpent"
                        }
                    },
                }
            })
        query.append(
            {
                "$addFields": {
                    "hours": {
                        "$arrayToObject": "$hours"
                    },
                }
            })

        query.append(
            {
                "$project": {
                    "project": "$_id.project",
                    "assignee": "$_id.assignee",
                    "hours": "$hours",
                    "_id": 0
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
