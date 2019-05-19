import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader, FormGroup, Input, Label, Alert} from "reactstrap";
import ConfigUtil from '../utils/ConfigUtil'

export default class Config extends Component {

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.checkData = this.checkData.bind(this);
        this.state = {
            alerts: {
                loading: false,
                error: false,
                success: false
            },
            formData: {
                jiraUrl: undefined,
                jiraLogin: undefined,
                jiraPassword: undefined,
            }
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
                                Параметры
                            </CardHeader>
                            <CardBody>
                                <Alert color="secondary" isOpen={this.state.alerts.loading}>
                                    Проверка...
                                </Alert>
                                <Alert color="danger" isOpen={this.state.alerts.error} toggle={this.onDismiss.bind(this, 'error')}>
                                    Ошибка
                                </Alert>
                                <Alert color="success" isOpen={this.state.alerts.success} toggle={this.onDismiss.bind(this, 'success')}>
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
                </div>
            </div>
        )
    }
}