import axios from "axios";

export default class ConfigUtil {
    static async checkJiraAuthData(jira_url, username, password) {
        let response = await axios.post('http://jira-stats.int.robotbull.com/api/auth/',
            {jira_url, username, password}
        );
    }
}