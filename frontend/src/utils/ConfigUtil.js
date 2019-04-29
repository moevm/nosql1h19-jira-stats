import axios from "axios";

export default class ConfigUtil {
    static async checkJiraAuthData(jira_url, username, password) {
        let response = await axios.post('http://100.124.0.7:32137/auth/',
            {jira_url, username, password}
        );
    }
}