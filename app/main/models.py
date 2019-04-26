from app.create_app import db


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


class User:

	def __init__(
			self,
			login='',
			avatar_url='',
			full_name=''):
		self.__login = login
		self.__avatar_url = avatar_url
		self.__full_name = full_name
