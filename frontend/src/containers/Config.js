import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader, FormGroup, Input, Label, Alert} from "reactstrap";
import ConfigUtil from '../utils/ConfigUtil'
import ImportExportUtil from '../utils/ImportExportUtil'

export default class Config extends Component {

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.checkData = this.checkData.bind(this);
        this.sendImportFile = this.sendImportFile.bind(this);
        this.sendImportJira = this.sendImportJira.bind(this);
        this.state = {
            alerts: {
                loading: false,
                error: false,
                success: false,
                file_loading: false,
                file_error: false,
                file_success: false
            },
            formData: {
                jiraUrl: undefined,
                jiraLogin: undefined,
                jiraPassword: undefined,
            },
            file: undefined,
            fileName: undefined,
        }
    }

    handleInputChange(event) {
        const target = event.target;
        this.setState({
            ...this.state, formData: {
                ...this.state.formData,
                [target.name]: target.value
            }
        });
    }

    handleFileChange(event) {
        this.setState({
            ...this.state, file: event.target.files[0], fileName: event.target.value
        });
    }

    sendImportFile() {
        this.setState({
            ...this.state,
            alerts: {...this.state.alerts, file_loading: true, file_error: false, file_success: false}
        });
        ImportExportUtil.importDatabase(this.state.file).then(() => {
            this.setState({
                ...this.state,
                alerts: {...this.state.alerts, file_loading: false, file_error: false, file_success: true}
            });
        }).catch(() => {
            this.setState({
                ...this.state,
                alerts: {...this.state.alerts, file_loading: true, file_error: true, file_success: false}
            });
        });
    }

    sendImportJira() {
        this.setState({
            ...this.state,
            alerts: {...this.state.alerts, file_loading: true, file_error: false, file_success: false}
        });
        ImportExportUtil.importJira().then(() => {
            this.setState({
                ...this.state,
                alerts: {...this.state.alerts, file_loading: false, file_error: false, file_success: true}
            });
        }).catch(() => {
            this.setState({
                ...this.state,
                alerts: {...this.state.alerts, file_loading: true, file_error: true, file_success: false}
            });
        });
    }

    checkData() {
        this.setState({...this.state, alerts: {...this.state.alerts, loading: true, error: false, success: false}});
        ConfigUtil.checkJiraAuthData(
            this.state.formData.jiraUrl,
            this.state.formData.jiraLogin,
            this.state.formData.jiraPassword,
        ).then(() => {
            this.setState({...this.state, alerts: {...this.state.alerts, loading: false, success: true}});
        }).catch(() => {
            this.setState({...this.state, alerts: {...this.state.alerts, loading: false, error: true}});
        });
    }

    onDismiss(type) {
        this.setState({...this.state, alerts: {...this.state.alerts, [type]: false}});
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-4">
                        <Card>
                            <CardHeader>
                                Параметры JIRA
                            </CardHeader>
                            <CardBody>
                                <Alert color="secondary" isOpen={this.state.alerts.loading}>
                                    Проверка...
                                </Alert>
                                <Alert color="danger" isOpen={this.state.alerts.error}
                                       toggle={this.onDismiss.bind(this, 'error')}>
                                    Ошибка
                                </Alert>
                                <Alert color="success" isOpen={this.state.alerts.success}
                                       toggle={this.onDismiss.bind(this, 'success')}>
                                    Данные успешно сохранены!
                                </Alert>
                                <FormGroup>
                                    <Label htmlFor="jiraUrl">JIRA Server Url</Label>
                                    <Input name="jiraUrl" type="url" value={this.state.formData.jiraUrl}
                                           placeholder="https://jira.robotbull.com"
                                           onChange={this.handleInputChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="jiraLogin">Jira Login</Label>
                                    <Input name="jiraLogin" type="text" value={this.state.formData.jiraLogin}
                                           placeholder="JiraStats"
                                           onChange={this.handleInputChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="jiraPassword">Jira Password</Label>
                                    <Input name="jiraPassword" type="password" value={this.state.formData.jiraPassword}
                                           onChange={this.handleInputChange}/>
                                </FormGroup>
                                <div className="form-actions">
                                    <Button color="primary" style={{width: '100%'}}
                                            onClick={this.checkData}>Обновить</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card>
                            <CardHeader>
                                Импорт/экспорт базы данных
                            </CardHeader>
                            <CardBody>
                                <Alert color="secondary" isOpen={this.state.alerts.file_loading}>
                                    Проверка...
                                </Alert>
                                <Alert color="danger" isOpen={this.state.alerts.file_error}
                                       toggle={this.onDismiss.bind(this, 'file_error')}>
                                    Ошибка
                                </Alert>
                                <Alert color="success" isOpen={this.state.alerts.file_success}
                                       toggle={this.onDismiss.bind(this, 'file_success')}>
                                    Данные успешно сохранены!
                                </Alert>
                                <FormGroup>
                                    <Input name="importFile" type="file" accept='.json' value={this.state.fileName}
                                           onChange={this.handleFileChange}/>
                                </FormGroup>
                                <div className="form-actions">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <Button color="dark" style={{width: '100%'}}
                                                    onClick={this.sendImportFile}>Импортировать</Button>
                                        </div>
                                        <div className="col-sm-6">
                                            <Button color="primary" style={{width: '100%'}}
                                                    onClick={this.sendImportJira}>Импорт из Jira</Button>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="form-actions">
                                    <Button color="success" style={{width: '100%'}}
                                            onClick={ImportExportUtil.exportDatabase}>Экспортировать</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}