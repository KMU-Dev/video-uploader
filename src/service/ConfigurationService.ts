import { path } from "app-root-path";
import { promises as fsPromises} from "fs";
import { TargetConig } from "../model/config";

export default class ConfigurationService {
    private static instance: ConfigurationService;

    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async getTargets() {
        const jsonStr = await fsPromises.readFile(path + '/uploaderconfig.json', 'utf-8');
        const json = JSON.parse(jsonStr);
        const targets = json.targets;

        const targetConfigs: TargetConig[] = []
        for (const target of targets) targetConfigs.push(target);
        
        return targetConfigs;
    }
}
